import db_utils as db
import re
import json
import json_format

# POST /api/addUser
def addUser(id):
    """
    Try to make a new user with the given id.

    Parameters
    ----------
    id: str
        User id
    
    Returns
    -------
    success: bool
        Whether the user was successfully added
    """
    try:
        db.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s);", (id, ''))
        return True
    except:
        return False

# POST /api/importDARS
# POST /api/saveCalendar
def updateCalendar(id, calendar):
    """
    Update calendar of user

    Parameters
    ----------
    id: str
        User id
    calendar: json
        Calendar to be updated
    
    Returns
    -------
    success: bool
        Whether the calendar was successfully updated
    msgs: List[str]
        List of error messages if these exist and the specific courses that caused them
        If there is an exception or invalid format, success will be False and msgs will contain the error message
    """
    try:
        
        calendar = str(calendar).replace("'", '"')

        # first check if the calendar is valid json format (syntactically)
        if not json_format.validate_json(calendar):
            return (False, ["Invalid JSON format"])

        # then check if the calendar is valid in terms of prerequisties (semantically) (most likely there will be a few prereqs that are not met, so still update the calendar)
        msgs = checkCalendar(calendar)

        # theoretically the user should already exist in the database so this is a bit redundant
        db.execute("INSERT INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (id, calendar, calendar))

        return (True, msgs)
    except Exception as e:
        return [False, [e]]

# POST /api/checkCalendar
def checkCalendar(calendar):
    """
    Check whether the given calendar is valid.

    Parameters
    ----------
    calendar: json
        Calendar to be checked
    
    Returns
    -------
    msgs: List[str]
        List of error messages if these exist and the specific courses that caused them
    """

    # Sample message about a course that doesn't have its prerequisites met
    # quarter,  year, course,           prereqs
    # "WI,      2021, CS 111, ['CS 32', 'CS 33', 'CS 35L']"

    msgs = []

    addMsg = lambda course, quarter, year, prereqs: msgs.append("{} , {} , {} , {}".format(quarter, year, course, str(prereqs)))

    # add epsilon to each quarter to help sort
    quarter2Num = {'WI': 0.1, 'SP': 0.2, 'SU': 0.3, 'FA': 0.4}

    # first convert json to a dictionary format
    calendar = json.loads(calendar)

    try:
        # now loop over each quarter in order
        list_of_quarters_sorted = sorted(calendar['calendar']['quarters'], key=lambda x: x['quarter']['year'] + quarter2Num[x['quarter']['name']])
    except:
        return True # if the calendar is empty, it is valid

    for quart_index, quarter_dict in enumerate(list_of_quarters_sorted):

        # get the current quarter dictionary
        curr_quarter = quarter_dict['quarter']

        # get the list of courses in the current quarter
        curr_quarter_classes = curr_quarter['courses']

        # loop over each course in the current quarter
        for curr_course_dict in curr_quarter_classes:
            curr_course = curr_course_dict['course']

            try:
                prereqs = [curr_course['pre_requisites'][i]['pre_requisite_name'] for i in range(len(curr_course['pre_requisites']))]
            except:
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

                    # if the course is in the list of prereqs, remove it
                    if prev_course['name'] in prereqs:
                        prereqs.remove(prev_course['name'])
            
            # if there are still prereqs left, the calendar has some invalid data
            if len(prereqs) > 0:
                addMsg(curr_course['name'], curr_quarter['name'], curr_quarter['year'], prereqs)          

    return msgs


####### testing the updateCalendar api and checkCalendar api #######

# print(addUser("000"))
# print(updateCalendar("000", json_format.example))
# print(checkCalendar(json_format.example))

###################################################################

# POST /api/getClasses
def getClasses(type_list=None, department_list=None, min_units=None, max_units=None, classes_taken=None):
    """
    Get all list of classes that satisfy the constraints on their: type, department, minimum units, maximum units, and requisites.

    Parameters
    ----------
    type_list: List[str]
        List of types of class. All classes returned have the specified type. (e.g. "req-cs")
    department_list: List[str]
        List of department names. All classes returned have the specified department. (e.g. "COM SCI")
    min_units: int
        Lower bound on units for classes returned. All classes returned have no fewer than min_units. (e.g. 2)
    max_units: int
        Upper bound on units for classes returned. All classes returned have no more than max_units. (e.g. 4)
    classes_taken: List[Tuple[str, str]]
        List of classes user has taken. Used to filter out classes who have one or more prerequisites not already taken. (e.g. [("MATH", "0031A"), ("MATH", "0031B")])
    
    Returns
    -------
    classes: List[Tuple]
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


####### testing the addUser api and getClasses api #######

# print(addUser("000"))
# getClasses(classes_taken=[("MATH", "0031A"), ("MATH", "0031B")])
# print(getClasses(type_list=["lower-cs", "lower-math"], classes_taken=[("MATH", "0031A"), ("MATH", "0031B")]))

##########################################################
