from re import M
import query_courses
import macros
import mysql.connector
import cons
from json_format import validate_json

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password=cons.password,
  database="bruinplanner"
)

mycursor = mydb.cursor()

# course_info = ('GE-AH-LC', 'AF AMER 1', 'AF AMER', '0001', '171', 5.0, None, None)
def addClass(course_info):
    """
    Attempts to add info about a certain class into database.

    Parameters
    ----------
    course_info: Tuple
        Tuple containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)

    Returns
    -------
    success: bool
        Whether course info could be successfully added
    """

    # query_courses.validateCourseInfo(course_info) #TODO
    #mycursor.execute("DELETE FROM courses WHERE name=%s", (course_info[1],)) # First delete existing entries to avoid duplication
    try:
        print("Attempting to add class", course_info[1])
        mycursor.execute("INSERT INTO courses (type, name, department, number, start_term, units, class_requisites, historical_offerings) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", course_info)
    except mysql.connector.errors.IntegrityError as e: #Occurs when class with same name already exists
        #TODO: Check for existence before attempting to add
        print("Failed to add class (see below exception)")
        print(e)
        return False
    mydb.commit()
    return True

def addClasses(course_infos):
    """
    Attempts to add info about a list of classes into database.

    Parameters
    ----------
    course_info: Tuple
        List of tuples, each containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)

    Returns
    -------
    success: List[bool]
        Whether all course infos could be successfully added
    """
    success = True
    for course_info in course_infos:
        result = addClass(course_info)
        success = success and result
    return success

def getEntries(): #TODO: Add filters
    """
    Returns all classes in the database

    Returns
    -------
    entries: List[Tuple]
        List of all classes in the database.
    """
    mycursor.execute("SELECT * FROM courses;")
    myresult = mycursor.fetchall()
    return myresult

def recursivelyAddPrereqs():
    """
    Recursively adds all prereqs for all classes in the database. Repeats until no more prereqs have been added.

    Returns
    -------
    classes: List[(tuple)]
        List of all prerequisites added
    """
    allClassesAdded = []
    classesAdded = getEntries()
    while classesAdded:
        newClassesAdded = []
        for course in getEntries():
            #print(course[1], end=" ")
            prereqs_text = course[-2]
            if prereqs_text:
                prereqs = prereqs_text.split(",")
                for prereq in prereqs:
                    zeroindex = prereq.find('0')
                    if not zeroindex == -1:
                        department = prereq[:zeroindex].strip()
                        number = prereq[zeroindex:].strip()
                        #print("(", department, ",", number, ") is a prereq for", course[1])
                        prereq_info = query_courses.parseCourse(department, number)
                        result = addClass(prereq_info)
                        if result:
                            newClassesAdded.append(prereq_info)
                    else:
                        print("No zero in", prereq)
        allClassesAdded += classesAdded
        classesAdded = newClassesAdded
    return allClassesAdded

def populateDatabase():
    req_cs_course_infos = query_courses.parseCoursesByName(macros.REQUIRED_CS_COURSES)
    addClasses(req_cs_course_infos)

    """
    ge_infos = query_courses.parseGEs(macros.GE_CATEGORIES)
    addClasses(ge_infos)
    """

    print(recursivelyAddPrereqs())

def convert_dars_to_json(dars_courses):
    """
    Converts a list of dars courses to a json object

    Parameters
    ----------
    dars_courses: List[Tuple]
            List of tuples, each containing:
            
            - Requirement
			- Course Name
			- Course Department
			- Course Description
			- Quarter
			- Year
			- Units
    
    Returns
    -------
    json: Dict
        Dictionary containing the json object
        
    """

    # TODO: define the json format

    return dars_courses

def populateDBFromDars(dars_courses, user_name, email):
    """
    Attempts to add info about previously taken courses into the given user's table.

    Parameters
    ----------
    course_info: Tuple
        List of tuples, each containing:
            
            - Requirement
			- Course Name
			- Course Department
			- Course Description
			- Quarter
			- Year
			- Units

    Returns
    -------
    success: bool
        Whether the users table could be successfully updated with the given courses
    """   
 
    try:
        print("Attempting to convert DARs courses to JSON and then add to database")
        # convert dars_courses a json object and then to a string
        json_dars_string = str(convert_dars_to_json(dars_courses))

        # validate the json string against the json schema
        valid_json_string = validate_json(json_dars_string)

        if not valid_json_string:
            print("Invalid JSON string")
            return False
        # try to add user to user table, updating the value of the calendar if the user already exists
        mycursor.execute("INSERT IGNORE INTO users (name, email, calendar) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (user_name, email, json_dars_string))
    except Exception as e: #Occurs when class with same name already exists
        traceback.print_exc()
        return False
    
    mydb.commit()
    
    return True

if __name__ == "__main__":
    populateDatabase()