import requests
import json

# Note: BEARER expires roughly every half hour
# Update BEARER by logging into https://developer.api.ucla.edu/api/261#/Classes/ extracting headers from curl command for some request
BEARER = '5xKa9AiPh9diZkqJTh3cxBJxTRA6'
HEADERS = {'accept': 'application/json', 'authorization': 'Bearer ' + BEARER}

VERBOSE = True

# Manually parsed from https://catalog.registrar.ucla.edu/major/2021/ComputerScienceBS
REQUIRED_CS_COURSES = [
    "COM SCI 1",
    "COM SCI 31",
    "COM SCI 32",
    "COM SCI 33",
    "COM SCI M51A",
    "COM SCI 111",
    "COM SCI 118",
    "COM SCI 131",
    "COM SCI 151B",
    "COM SCI M152A",
    "COM SCI 180",
    "COM SCI 181",
    "STATS 100A",
    "MATH 31A",
    "MATH 31B",
    "MATH 32A",
    "MATH 32B",
    "MATH 33A",
    "MATH 33B",
    "MATH 61",
    "PHYSICS 1A",
    "PHYSICS 1B",
    "PHYSICS 1C",
    "PHYSICS 4AL",
    "PHYSICS 4BL"
]

def makeAPIRequest(URL):
    s = requests.Session()
    s.headers.update(HEADERS)
    r = s.get(URL)
    try:
        r_j = json.loads(r.text)
    except:
        r_j = None
    return r_j

def getGEClassesURL(category, subcategory):
    URL =  "https://api.ucla.edu/sis/gefoundations/{}/{}/gefoundationcategorycourses/v1?PageSize=10".format(category, subcategory)
    return URL

def getCourseDetailURL(category, number, start_term):
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/coursedetail/v1".format(category, number, start_term)
    return URL

def getCourseLatestStartTermURL(category, number):
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&courseCatalogNumber={}".format(category, number)
    return URL

def getCourseRequisitesURL(category, number, start_term):
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/courserequisites/v1".format(category, number, start_term)
    return URL

# human readable number to course API number
def encodeNumber(number):
    if number[0] == "M":
        number = encodeNumber(number[1:]) + " M"
    
    numDigits = sum(c.isdigit() for c in number)
    if numDigits <= 4:
        number = '0' * (4 - numDigits) + number
    return number

# course API number to human readable number
def decodeNumber(number):
    number = number.strip("0")
    if number[-1] == "M":
        number = "M" + number.split(" ")[0]
    return number

def getCourseLatestStartTerm(category, number):
    start_term_info = makeAPIRequest(getCourseLatestStartTermURL(category, number))
    start_term = start_term_info['courses'][0]['courseCatalogNumberCollection'][-1]['courseStartTermCode']
    return start_term

def courseNameToCategoryNumber(course_name):
    category = " ".join(course_name.split(" ")[:-1])
    number = course_name.split(" ")[-1]
    number = encodeNumber(number)
    return category, number

def parseCourse(category, number, start_term=None):
    if VERBOSE:
        print("Getting course info for", category, number)

    #number = encodeNumber(number)

    if not start_term:
        start_term = getCourseLatestStartTerm(category, number)
        pass
    class_detail_info = makeAPIRequest(getCourseDetailURL(category, number, start_term))
    class_requisites_info = makeAPIRequest(getCourseRequisitesURL(category, number, start_term))

    # get units
    units = sum([float(activity['courseUnitCollection'][0]['courseUnit']) for activity in class_detail_info["courseDetail"]["courseActivityCollection"]])

    # get prerequisites
    if class_requisites_info:
        class_requisites = [requisite["requisiteCourseName"] for requisite in class_requisites_info['courseRequisite']['requisiteCollection']]
    else:
        class_requisites = None

    # get historical offerings
    # TODO
    
    name = category + " " + decodeNumber(number)
    courseInfo = (name, category, number, start_term, units, class_requisites)
    
    if VERBOSE:
        print(courseInfo)
    return courseInfo

def parseCourses(courses):
    courseInfos = []
    for course in courses:
        if len(course) == 2:
            category, number = course
            start_term = None
        elif len(course) == 3:
            category, number, start_term = course
        else:
            raise Exception("Incorrectly formatted course {}".format(course))
        
        courseInfo = parseCourse(category, number, start_term=start_term)
        courseInfos.append(courseInfo)
    return courseInfos

def parseCoursesByName(course_names):
    courses = []
    for course_name in course_names:
        category, number = courseNameToCategoryNumber(course_name)
        courses.append((category, number))
    return parseCourses(courses)

def parseGEs():
    ge_categories = [
        "GE-AH-LC",
        "GE-AH-VP",
        "GE-SC-HA",
        "GE-SC-SA",
        "GE-SI-LS"
    ]
    ge_course_infos = {}
    for ge_category in ge_categories:
        category, subcategory = ge_category.split("-")[1:]
        response = makeAPIRequest(getGEClassesURL(category, subcategory))
        ge_course_collection = response["geFoundationCategoryCourses"][0]["courseCollection"]
        
        course_infos = []
        for course in ge_course_collection:
            category, number, start_term = course["subjectAreaCode"], course["courseCatalogNumber"], course["courseStartTermCode"]
            course_infos.append(parseCourse(category, number, start_term))
        ge_course_infos[ge_category] = course_infos
    
    return ge_course_infos

parseGEs()
parseCoursesByName(REQUIRED_CS_COURSES)