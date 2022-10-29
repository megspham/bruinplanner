from url_utils import *
from macros import *

# human readable number to course API number
# e.g "0152A M" -> "M152A"
def encodeNumber(number):
    if number[0] == "M":
        number = encodeNumber(number[1:]) + " M"
    
    numDigits = sum(c.isdigit() for c in number)
    if numDigits <= 4:
        number = '0' * (4 - numDigits) + number
    return number

# course API number to human readable number
# e.g "M152A" -> "0152A M"
def decodeNumber(number):
    number = number.strip("0")
    if number[-1] == "M":
        number = "M" + number.split(" ")[0]
    return number

def getCourseLatestStartTerm(department, number):
    start_term_info = makeAPIRequest(getCourseURL(department, number))
    start_term = start_term_info['courses'][0]['courseCatalogNumberCollection'][-1]['courseStartTermCode']
    return start_term

def courseNameToDepartmentNumber(course_name):
    department = " ".join(course_name.split(" ")[:-1])
    number = course_name.split(" ")[-1]
    number = encodeNumber(number)
    return department, number

def parseCourse(department, number, start_term=None, type=None):
    if VERBOSE:
        print("Getting course info for", department, number)

    #number = encodeNumber(number)

    if not start_term:
        start_term = getCourseLatestStartTerm(department, number)
        pass
    class_detail_info = makeAPIRequest(getCourseDetailURL(department, number, start_term))
    class_requisites_info = makeAPIRequest(getCourseRequisitesURL(department, number, start_term))

    # get units
    units = sum([float(activity['courseUnitCollection'][0]['courseUnit']) for activity in class_detail_info["courseDetail"]["courseActivityCollection"]])

    # get prerequisites
    if class_requisites_info:
        class_requisites = [requisite["requisiteCourseName"] for requisite in class_requisites_info['courseRequisite']['requisiteCollection']]
    else:
        class_requisites = None

    # get historical offerings
    # TODO
    
    name = department + " " + decodeNumber(number)
    courseInfo = (type, name, department, number, start_term, units, class_requisites)
    
    if VERBOSE:
        print(courseInfo)
    return courseInfo

def parseCourses(courses):
    courseInfos = []
    for course in courses:
        if len(course) == 2:
            department, number = course
            start_term = None
        elif len(course) == 3:
            department, number, start_term = course
        elif len(course) == 4:
            department, number, start_term, type = course
        else:
            raise Exception("Incorrectly formatted course {}".format(course))
        
        courseInfo = parseCourse(department, number, start_term=start_term, type=type)
        courseInfos.append(courseInfo)
    return courseInfos

def parseCoursesByName(course_names_types):
    courses = []
    for course_name, course_type in course_names_types:
        department, number = courseNameToDepartmentNumber(course_name)
        courses.append((department, number, None, course_type))
    return parseCourses(courses)

def parseGEs(categories):
    ge_course_infos = {}
    for ge_category in categories:
        category, subcategory = ge_category.split("-")[1:]
        response = makeAPIRequest(getGEClassesURL(category, subcategory))
        ge_course_collection = response["geFoundationCategoryCourses"][0]["courseCollection"]
        
        ge_courses = []
        for course in ge_course_collection:
            department, number, start_term = course["subjectAreaCode"], course["courseCatalogNumber"], course["courseStartTermCode"]
            ge_courses.append((department, number, start_term, ge_category))
        ge_course_infos[ge_category] = parseCourses(ge_courses)
    
    return ge_course_infos

if __name__ == "__main__":
    parseGEs(GE_CATEGORIES)
    parseCoursesByName(REQUIRED_CS_COURSES)