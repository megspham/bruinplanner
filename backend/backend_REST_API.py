import db_utils as db
import re
import json
import json_format
import parse_dars
import populate_database
import difflib

# POST /api/addUser
def addUser(id):
    """
    Try to make a new user with the given id.

    Args:
        id (str) : The id of the user to be added
    
    Returns:
        Boolean indicating whether the user was successfully added
    """
    try:
        db.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s);", (id, ''))
        return True
    except:
        return False

# POST /api/importDARS
def importDARS(id, start_quarter, start_year, dars_file):
    """
    Import a DARS file to the user's calendar

    Args:
        id (str) : The id of the user who's calendar to update
        start_quarter (str) : The quarter the user started at UCLA  
        start_year (int) : The year the user started at UCLA
        dars_file (str) : The DARS file to import
    
    Returns:
        Boolean indicating whether the DARS file was successfully imported
    """

    try:
        # first parse the DARS file
        dars = parse_dars.parse_dars(dars_file, start_quarter, start_year)

        # then populate the database with the parsed DARS file
        return populate_database.updateUserCalendar(dars, id)

    except:
        return False

# POST /api/getCalendar
def getCalendar(id):
    """
    Get the calendar of the user with the given id

    Args:
        id (str) : The id of the user who's calendar to get
    
    Returns:
        The calendar of the user with the given id
    """
    try:
        return db.execute("SELECT calendar FROM users WHERE id=%s;", (id,))[0][0]
    except Exception as e:
        print(e)
        return None

# POST /api/updateCalendar
def updateCalendar(id, calendar):
    """
    Update calendar of user

    Args:
        id (str) : The id of the user who's calendar to update
        calendar (str) : The calendar to update the user's calendar with

    
    Returns:
        Boolean indicating whether the calendar was successfully updated
     """
    try:
        
        calendar = str(calendar).replace("'", '"')

        # first check if the calendar is valid json format (syntactically)
        if not json_format.validate_json(calendar):
            return None

        # then check if the calendar is valid in terms of prerequisties (semantically) (most likely there will be a few prereqs that are not met, so still update the calendar)
        calendar_with_possible_errors = str(checkCalendar(calendar)).replace("'", '"')

        # check if the calendar is valid json format (syntactically)
        if not json_format.validate_json(calendar_with_possible_errors):
            return None

        # theoretically the user should already exist in the database so this is a bit redundant
        db.execute("INSERT INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (id, calendar, calendar))

        return calendar_with_possible_errors
    except Exception as e:
        print(e)
        return None

# POST /api/checkCalendar
def checkCalendar(calendar):
    """
    Check whether the given calendar is valid.

    Args:
        calendar (str) : The calendar to check
    
    Returns:
        Calendar with error messages if these exist and the specific courses that caused them
    """

    # add epsilon to each quarter to help sort
    quarter2Num = {'WI': 0.1, 'SP': 0.2, 'SU': 0.3, 'FA': 0.4}

    # first convert json to a dictionary format
    calendar = json.loads(calendar)

    try:
        # now loop over each quarter in order
        list_of_quarters_sorted = sorted(calendar['calendar']['quarters'], key=lambda x: x['quarter']['year'] + quarter2Num[x['quarter']['quarter']])
    except:
        print("Calendar is empty. Calendar will be returned as is.")
        return calendar # if the calendar is empty, it is valid

    for quart_index, quarter_dict in enumerate(list_of_quarters_sorted):

        # get the current quarter dictionary
        curr_quarter = quarter_dict['quarter']

        # get the list of courses in the current quarter
        curr_quarter_classes = curr_quarter['courses']

        # loop over each course in the current quarter
        for curr_course_dict in curr_quarter_classes:
            curr_course = curr_course_dict['course']
            def my_split(s):
                split_list = list(filter(None, re.split(r'(\d+)', s)))
                try:
                    stripped_course_num = str(int(split_list[-1]))
                    return split_list[0] + ' ' + stripped_course_num
                except:
                    stripped_course_num = str(int(split_list[-2]))
                    return split_list[0] + ' ' + stripped_course_num + split_list[-1]
            try:
                # prereqs = [curr_course['pre_requisites'][i]['pre_requisite_name'] for i in range(len(curr_course['pre_requisites']))]
                prereqs = db.execute("SELECT class_requisites FROM courses WHERE name=%s", (curr_course['name'], ))
                if prereqs == []:
                    continue
                else:
                    prereqs = prereqs[0][0].split(',')
                    print(prereqs)
                    prereqs = list(map(lambda course : my_split(course), prereqs))
                    print(prereqs)
            except Exception as e:
                print(curr_course['name'], e)
                continue # there are no prereqs for this course
            
            # loop over every previous quarter
            for prev_quarter_dict in list_of_quarters_sorted[:quart_index]:

                # get the previous quarter dictionary
                prev_quarter = prev_quarter_dict['quarter']

                # get the list of courses in the previous quarter
                prev_quarter_classes = prev_quarter['courses']

                # loop over each course in the previous quarter
                for prev_course_dict in prev_quarter_classes:
                
                    prev_course = prev_course_dict['course']

                    # if the course is in the list of prereqs, remove it, use the similarity function to check if the course is similar enough to the prereq
                    for prereq in prereqs:
                        if prereq == prev_course['name'] or prereq.replace(' ', '') == prev_course['name'].replace(' ', ''):
                            prereqs.remove(prereq)
                            break
            
            # if there are still prereqs left not met, add an error message to the course listing the prereqs that are not met
            if len(prereqs) > 0:       
                curr_course['unsatisfied_pre_requisites'] = [{'name': prereq_course} for prereq_course in prereqs]

    return calendar

# POST /api/getClasses
def getClasses(type_list=None, department_list=None, min_units=None, max_units=None, classes_taken=None):
    """
    Get all list of classes that satisfy the constraints on their: type, department, minimum units, maximum units, and requisites.

    Args:
        type_list (list) : List of types of class. All classes returned have the specified type. (e.g. "req-cs")
        department_list (list) : List of departments names. All classes returned have the specified department. (e.g. "CS")
        min_units (int) : Lower bound on units for classes returned. All classes returned have no fewer than min_units. (e.g. 2)
        max_units (int) : Upper bound on units for classes returned. All classes returned have no more than max_units. (e.g. 4)
        classes_taken (list) : List of classes user has taken. Used to filter out classes who have one or more prerequisites not already taken. (e.g. [("MATH", "0031A"), ("MATH", "0031B")])

    Returns:
        List of tuples, each containing course information for a certain class.
    """
    def requisites_fulfilled(course):
        if course[-2] is None:
            return True
        
        course_requisites = [req for req in course[-2].split(",")]
        course_requisites = []
        for req in course[-2].split(","):
            num_index = re.search(r"\d", req)
            if num_index is None:
                continue
            num_index = num_index.start()
            course_requisites.append((req[:num_index].strip(), req[num_index:].strip()))

        untaken_prerequisites = list(filter(lambda course : course not in classes_taken, course_requisites))
        result = untaken_prerequisites == [] 
        return result

    if type_list is None:
        type_list=[None]
    if department_list is None:
        department_list=[None]

    all_courses = []
    for type_ in type_list:
        for department in department_list:
            # Filter for type, department, min_units, max_units in query itself
            constraints = [
                ("type=%s", type_ if type_ is not None else None), 
                ("department=%s", department if department is not None else None),
                ("units>=%s", min_units),
                ("units<=%s", max_units)
            ]
            constraints = list(filter((lambda x : x[1] is not None), constraints))

            query = "SELECT * FROM courses"
            if constraints:
                query += " WHERE " + " AND ".join([x[0] for x in constraints])
            query += ";"
            
            courses = db.execute(query, [x[1] for x in constraints])

            # Filter for requisites once results have been obtained
            if classes_taken:
                courses = list(filter(requisites_fulfilled, courses))
    
            all_courses += courses
    return all_courses


################################## testing the addUser api and getClasses api ##################################

# print(addUser("000"))
# getClasses(classes_taken=[("MATH", "0031A"), ("MATH", "0031B")])
# print(getClasses(type_list=["lower-cs", "lower-math"], classes_taken=[("MATH", "0031A"), ("MATH", "0031B")]))

################################################################################################################

################################## testing the getCalendar and importDars api ##################################

# print(importDARS('000', 'Fall', 2019, '../tests/backend/dars_parsing/test_data/test1.html'))
# print(getCalendar('000'))

################################################################################################################

############################# testing the updateCalendar api and checkCalendar api #############################

# print(addUser("000"))
# print(updateCalendar("000", json_format.example))
# print(json_format.validate_json(str(checkCalendar(json_format.example)).replace("'", '"')))

################################################################################################################