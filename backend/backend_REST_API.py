import db_utils as db
import re

# POST /api/addUser
def addUser(id, name, email):
    """
    Make new table for user
    """
    db.execute("INSERT IGNORE INTO users (id, name, email) VALUES (%s, %s, %s);", (id, name, email))
    return

# POST /api/importDARS
# POST /api/saveCalendar
def updateCalendar(id, calendar):
    """
    Update calendar of user
    """
    #checkCalendar(dars_calendar) #TODO
    #checkUserExistsInDB(id) #TODO
    db.execute("UPDATE users SET calendar=%s WHERE id=%s;", (calendar, id))
    return

# POST /api/checkCalendar
def checkCalendar(calendar):
    """
    Check whether the a given calendar is valid.
    """
    return

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

#addUser("000", "Test User", "test@gmail.com")
#getClasses(classes_taken=[("MATH", "0031A"), ("MATH", "0031B")])
print(getClasses(type_list=["lower-cs", "lower-math"], classes_taken=[("MATH", "0031A"), ("MATH", "0031B")]))