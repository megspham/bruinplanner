import mysql.connector
import json
import requests

import macros
import db_utils

def makeAPIRequest(URL):
    """
    Makes an API request to UCLA course API, sending URL.

    Args:
        URL (str): API request to make to UCLA courses/classes API

    Returns:
        dict: JSON response from API
    """
    s = requests.Session()
    s.headers.update(macros.HEADERS)
    r = s.get(URL)
    #print(URL)
    #print(r)
    try:
        r_j = json.loads(r.text)
    except:
        r_j = None
    return r_j

def getClassesURL(department):
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&PageSize={}".format(department, 100)
    return URL

def getGEClassesURL(category, subcategory):
    """
    Generates URL to query courses API to get list of GEs.

    Args:
        category (str): GE category (e.g. AH)
        subcategory (str): GE subcategory (e.g. LC)

    Returns:
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/gefoundations/{}/{}/gefoundationcategorycourses/v1?PageSize=10".format(category, subcategory)
    return URL

def getCourseDetailURL(category, number, start_term):
    """
    Generates URL to query courses API to details about a certain course.

    Args:
        category (str): class category
        number (str): class number
        start_term (str): class start term

    Returns:
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/coursedetail/v1".format(category, number, start_term)
    return URL

def getCourseRequisitesURL(category, number, start_term):
    """
    Generates URL to query courses API to get requisites for a certain course.

    Args:
        category (str): class category
        number (str): class number
        start_term (str): class start term

    Returns:
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/courserequisites/v1".format(category, number, start_term)
    return URL

def getCourseURL(category, number):
    """
    Generates URL to query courses API to get all courses with given category and start_term.
    Each course may have different start term.

    Args:
        category (str): class category
        number (str): class number

    Returns:
        Generated URL
    """
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&courseCatalogNumber={}".format(category, number)
    return URL

def getHistoricalOfferingsURL(offeredTermCode, category, number):
    """
    Generates URL to query classes API to determine whether a course with given category and number
        was offered in a certain term.

    Args:
        offeredTermCode (str): term code to check if course was offered
        category (str): class category
        number (str): class number

    Returns:
        Generated URL
    """
    URL = "https://api.ucla.edu/sis/classes/{}/v1?subjectAreaCode={}&courseCatalogNumber={}".format(offeredTermCode, category, number)
    return URL

def encodeNumber(number):
    """
    Converts course API number to course human readable number (e.g "0152A M" -> "M152A")

    Args:
        number (str): human readable number

    Returns:
        course API number
    """
    if number[0] == "M":
        number = encodeNumber(number[1:]) + " M"
    
    numDigits = sum(c.isdigit() for c in number)
    if numDigits <= 4:
        number = '0' * (4 - numDigits) + number
    return number

def decodeNumber(number):
    """
    Converts course human readable number to course API number (e.g "M152A" -> "0152A M")

    Args:
        number (str): course API number

    Returns:
        human readable number
    """
    number = number.lstrip("0")
    if number[-1] == "M":
        number = "M" + number.split(" ")[0]
    return number

def courseNameToDepartmentNumber(course_name):
    """
    Converts a course name into department and number.

    Args:
        course_name (str): name of course in question

    Returns:
        Tuple of department for course and number for course
    """
    department = " ".join(course_name.split(" ")[:-1])
    number = course_name.split(" ")[-1]
    number = encodeNumber(number)
    return department, number

def getCourseLatestStartTerm(department, number):
    """
    Gets latest start term for a particular course

    Args:
        department (str): department of course
        number (str): number of course

    Returns:
        Start term for course
    """
    start_term_info = makeAPIRequest(getCourseURL(department, number))
    start_term = start_term_info['courses'][0]['courseCatalogNumberCollection'][-1]['courseStartTermCode']
    return start_term

def parseCourse(department, number, start_term=None, type_=None):
    """
    Parses department name and number (and optionally start_term) of a certain course to obtain course info.
    Course info is a tuple containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings
    
    Args:
        department (str): department of course
        number (str): number of course
        start_term (str): start term of course
        type_ (str): category of requirement fulfilled by course in question

    Returns:
        Tuple containing course type, course name, department, course number, course start term, course units, course requisites, historical offerings
    """
    if macros.VERBOSE:
        print("Getting course info for", department, number)

    # get start term
    if not start_term:
        start_term = getCourseLatestStartTerm(department, number)
        pass
    
    # get information about the class
    class_detail_info = makeAPIRequest(getCourseDetailURL(department, number, start_term))
    class_requisites_info = makeAPIRequest(getCourseRequisitesURL(department, number, start_term))

    # get units
    units = sum([float(activity['courseUnitCollection'][0]['courseUnit']) for activity in class_detail_info["courseDetail"]["courseActivityCollection"]])

    # get prerequisites
    if class_requisites_info:
        class_requisites_list = []
        for requisite in class_requisites_info['courseRequisite']['requisiteCollection']:
            requisiteName = requisite['requisiteCourseName']
            number_index = 0
            numberFound = False
            for c in requisiteName:
                if c.isdigit():
                    numberFound = True
                    break
                number_index += 1
            if numberFound:
                requisite_department = requisite["requisiteCourseName"][:number_index].strip()
                requisite_number = requisite["requisiteCourseName"][number_index:].strip().lstrip("0")
                class_requisites_list.append(requisite_department + " " + requisite_number)
            else:
                class_requisites_list.append(requisiteName)
        class_requisites = ", ".join(class_requisites_list)
    else:
        class_requisites = None

    # get historical offerings- TODO
    historical_offerings = None
    
    # create name
    name = department + " " + decodeNumber(number)
    
    # construct and return courseInfo
    courseInfo = (type_, name, department, number, start_term, units, class_requisites, historical_offerings)
    
    if macros.VERBOSE:
        print(courseInfo)
    return courseInfo

def parseCourses(courses):
    """
    Parses department name and number (and optionally start_term) of a list of courses to obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Args:
        courses (list): List of courses to be parsed using parseCourse

    Returns:
        List of courseInfo tuples, each of which corresponds to a course in courses
    """
    courseInfos = []
    for course in courses:
        department = course[0]
        number = course[1]
        start_term = course[2] if len(course)>=3 else None
        type_ = course[3] if len(course)>=4 else None
        
        if department=="COM SCI" and "0186" in number: #These classes usually result in gateway error, so skipping them for now
            continue

        courseInfo = parseCourse(department, number, start_term=start_term, type_=type_)
        courseInfos.append(courseInfo)
    return courseInfos

def parseCoursesByName(course_names_types):
    """
    Parses list of course names into a list containing obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Args:
        course_names_types (list): List of courses to be parsed using parseCourses

    Returns:
        List of courseInfo tuples, each of which corresponds to a course in courses
    """
    courses = []
    for course_name, course_type in course_names_types:
        department, number = courseNameToDepartmentNumber(course_name)
        courses.append((department, number, None, course_type))
    return parseCourses(courses)

def parseElectives():
    response = makeAPIRequest(getClassesURL("COM SCI"))
    course_collection = []
    while True:
        course_collection += response["courses"][0]["courseCatalogNumberCollection"]
        nextPage = False
        for link in response["links"]:
            if link["rel"] == "nextPage":
                response = makeAPIRequest(link["href"] + "&subjectAreaCode=COM%20SCI")
                nextPage = True
        if not nextPage:
            break

    print(course_collection)

    courses = []
    for course in course_collection:
        courseNumber = course["courseCatalogNumber"]

        courseNumberStripped = ""
        for c in courseNumber:
            if c.isdigit():
                courseNumberStripped += c
        courseNumberStripped = int(courseNumberStripped)

        if not (courseNumberStripped >= 111 and courseNumberStripped <= 188):
            continue

        # In the following block, we are ensuring that each course is repeated only once
        # Basically we want to avoid duplicate start terms
        # Start terms increase along with the course entries, so we always overwrite the previous entry
        repeatIndex = -1
        for i in range(len(courses)):
            course_sub = courses[i]
            if course_sub[1] == course["courseCatalogNumber"]:
                repeatIndex = i
                break
        if repeatIndex != -1:
            courses.remove(courses[repeatIndex])
        courses.append(("COM SCI", course["courseCatalogNumber"], course["courseStartTermCode"], "cs-elective"))

    print(courses)
    courseInfos = parseCourses(courses)
    return courseInfos

def parseGEs(categories):
    """
    Parses list of GE categories into a list of tuples, each being a course info.

    Args:
        categories (list): List of GE categories to be parsed

    Returns:
        List of courseInfo tuples, each of which corresponds to a GE course
    """
    ge_course_infos = []
    for ge_category in categories:
        category, subcategory = ge_category.split("-")[1:]
        ge_course_collection = []
        response = makeAPIRequest(getGEClassesURL(category, subcategory))
        while True:
            ge_course_collection += response["geFoundationCategoryCourses"][0]["courseCollection"]
            nextPage = False
            for link in response["links"]:
                if link["rel"] == "nextPage":
                    response = makeAPIRequest(link["href"])
                    nextPage = True
            if not nextPage:
                break
        
        ge_courses = []
        for course in ge_course_collection:
            department, number, start_term = course["subjectAreaCode"], course["courseCatalogNumber"], course["courseStartTermCode"]
            ge_courses.append((department, number, start_term, ge_category))
        ge_course_infos += parseCourses(ge_courses)
    
    return ge_course_infos

# course_info = ('GE-AH-LC', 'AF AMER 1', 'AF AMER', '0001', '171', 5.0, None, None)
def addClass(course_info):
    """
    Attempts to add info about a certain class into database.

    Args:
        course_info (tuple): Tuple containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)

    Returns:
        True if class was added successfully, False otherwise
    """

    # validateCourseInfo(course_info) #TODO
    #mycursor.execute("DELETE FROM courses WHERE name=%s", (course_info[1],)) # First delete existing entries to avoid duplication
    try:
        print("Attempting to add class", course_info[1])
        db_utils.execute("INSERT INTO courses (type, name, department, number, start_term, units, class_requisites, historical_offerings) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", course_info)
    except mysql.connector.errors.IntegrityError as e: #Occurs when class with same name already exists
        #TODO: Check for existence before attempting to add
        print("Failed to add class (see below exception)")
        print(e)
        return False
    return True

def addClasses(course_infos):
    """
    Attempts to add info about a list of classes into database.

    Args:
        course_infos (list): List of tuples, each containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)

    Returns:
        True if all classes were added successfully, False otherwise
    """
    success = True
    for course_info in course_infos:
        result = addClass(course_info)
        success = success and result
    return success

def getEntries(): #TODO: Add filters
    """
    Returns all classes in the database

    Returns:
        List of all classes in the database.
    """
    myresult = db_utils.execute("SELECT * FROM courses;")
    return myresult

def recursivelyAddPrereqs():
    """
    Recursively adds all prereqs for all classes in the database. Repeats until no more prereqs have been added.

    Returns:
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
                        prereq_info = parseCourse(department, number)
                        result = addClass(prereq_info)
                        if result:
                            newClassesAdded.append(prereq_info)
                    else:
                        print("No zero in", prereq)
        allClassesAdded += classesAdded
        classesAdded = newClassesAdded
    return allClassesAdded

def addHistoricalOfferings():
    classes = getEntries()
    for class_ in classes:
        historical_offerings = []
        for term in macros.PAST_TERMS:
            r = makeAPIRequest(getHistoricalOfferingsURL(term, class_[2], class_[3]))
            if r is not None:
                historical_offerings.append(term)
        db_utils.execute("UPDATE courses SET historical_offerings=%s WHERE department=%s AND number=%s", (",".join(historical_offerings), class_[2], class_[3]))

def populateCourses():
    # req_cs_course_infos = parseCoursesByName(macros.REQUIRED_CS_COURSES)
    # addClasses(req_cs_course_infos)

    # ge_infos = parseGEs(macros.GE_CATEGORIES)
    # addClasses(ge_infos)

    # elective_course_infos = parseElectives()
    # addClasses(elective_course_infos)

    recursivelyAddPrereqs()
    addHistoricalOfferings()

if __name__ == "__main__":
    populateCourses()