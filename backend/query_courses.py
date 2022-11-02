from url_utils import *
from macros import *
import course_utils

def getCourseLatestStartTerm(department, number):
    """
    Gets latest start term for a particular course

    Parameters
    ----------
    department: str
        department for course
    number: str
        number for course

    Returns
    -------
    start_term: str
        start term for course
    """
    start_term_info = makeAPIRequest(getCourseURL(department, number))
    start_term = start_term_info['courses'][0]['courseCatalogNumberCollection'][-1]['courseStartTermCode']
    return start_term

def parseCourse(department, number, start_term=None, type_=None):
    """
    Parses department name and number (and optionally start_term) of a certain course to obtain course info.
    Course info is a tuple containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings
    
    Parameters
    ----------
    department: str
        department of course in question
    number: str
        number of course in question
    start_term: Optional[str]
        start term of course in question
    type_: str
        category of requirement fulfilled by course in question

    Returns
    -------
    courseInfo: tuple
        tuple containing course type, course name, department, course number, course start term, course units, course requisites, historical offerings
    """
    if VERBOSE:
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
        class_requisites = ",".join([requisite["requisiteCourseName"] for requisite in class_requisites_info['courseRequisite']['requisiteCollection']])
    else:
        class_requisites = None

    # get historical offerings- TODO
    historical_offerings = None
    
    # create name
    name = department + " " + course_utils.decodeNumber(number)
    
    # construct and return courseInfo
    courseInfo = (type_, name, department, number, start_term, units, class_requisites, historical_offerings)
    
    if VERBOSE:
        print(courseInfo)
    return courseInfo

def parseCourses(courses):
    """
    Parses department name and number (and optionally start_term) of a list of courses to obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Parameters
    ----------
    courses: List[(department, number, [start_term, [type_]])]
        List of courses to be parsed using parseCourse

    Returns
    -------
    courseInfos: List[(type_, name, department, number, start_term, units, class_requisites, historical_offerings)]
        List of courseInfo tuples, each of which corresponds to a course in courses
    """
    courseInfos = []
    for course in courses:
        department = course[0]
        number = course[1]
        start_term = course[2] if len(course)>=3 else None
        type_ = course[3] if len(course)>=4 else None
        
        courseInfo = parseCourse(department, number, start_term=start_term, type_=type_)
        courseInfos.append(courseInfo)
    return courseInfos

def parseCoursesByName(course_names_types):
    """
    Parses list of course names into a list containing obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Parameters
    ----------
    course_names_types: List[Tuple(course_name, course_type)]
        List of courses to be parsed using parseCourses

    Returns
    -------
    courseInfos: List[(type_, name, department, number, start_term, units, class_requisites, historical_offerings)]
        List of courseInfo tuples, each of which corresponds to a course in courses
    """
    courses = []
    for course_name, course_type in course_names_types:
        department, number = course_utils.courseNameToDepartmentNumber(course_name)
        courses.append((department, number, None, course_type))
    return parseCourses(courses)

def parseGEs(categories):
    """
    Parses list of GE categories into a list of tuples, each being a course info.

    Parameters
    ----------
    categories: List[str]
        List of GE categories to be parsed

    Returns
    -------
    ge_course_infos: List[Tuple]
        List of courseInfo tuples, each of which corresponds to a GE course
    """
    ge_course_infos = []
    for ge_category in categories:
        category, subcategory = ge_category.split("-")[1:]
        response = makeAPIRequest(getGEClassesURL(category, subcategory))
        ge_course_collection = response["geFoundationCategoryCourses"][0]["courseCollection"]
        
        ge_courses = []
        for course in ge_course_collection:
            department, number, start_term = course["subjectAreaCode"], course["courseCatalogNumber"], course["courseStartTermCode"]
            ge_courses.append((department, number, start_term, ge_category))
        ge_course_infos += parseCourses(ge_courses)
    
    return ge_course_infos