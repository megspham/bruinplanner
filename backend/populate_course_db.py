from operator import ge
import requests
import json

# Note: BEARER expires roughly every half hour
# Update BEARER by logging into https://developer.api.ucla.edu/api/261#/Classes/ extracting headers from curl command for some request
BEARER = 'pcnqzTU69LvoEW7IsCGZr2XhxXSy'
HEADERS = {'accept': 'application/json', 'authorization': 'Bearer ' + BEARER}

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
    #category = category.replace(" ", "%20")
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&courseCatalogNumber={}".format(category, number)
    return URL

def getCourseRequisitesURL(category, number, start_term):
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/courserequisites/v1".format(category, number, start_term)
    return URL

def formatNumber(number):
    if number[0] == "M":
        number = formatNumber(number[1:]) + " M"
    
    numDigits = sum(c.isdigit() for c in number)
    if numDigits <= 4:
        number = '0' * (4 - numDigits) + number
    return number

def getCourseLatestStartTerm(category, number):
    start_term_info = makeAPIRequest(getCourseLatestStartTermURL(category, number))
    start_term = start_term_info['courses'][0]['courseCatalogNumberCollection'][-1]['courseStartTermCode']
    return start_term

def parseCourse(category, number, start_term=None):
    number = formatNumber(number)

    if not start_term:
        start_term = getCourseLatestStartTerm(category, number)
        pass
    class_detail_info = makeAPIRequest(getCourseDetailURL(category, number, start_term))
    class_requisites_info = makeAPIRequest(getCourseRequisitesURL(category, number, start_term))

    # get units
    #print(class_detail_info)
    units = sum([float(activity['courseUnitCollection'][0]['courseUnit']) for activity in class_detail_info["courseDetail"]["courseActivityCollection"]])

    # get prerequisites
    if class_requisites_info:
        class_requisites = [requisite["requisiteCourseName"] for requisite in class_requisites_info['courseRequisite']['requisiteCollection']]
    else:
        class_requisites = None

    # get historical offerings
    
    return category, number, start_term, units, class_requisites

def parseCourseCollection(course_collection):
    courses = []
    for course in course_collection:
        category, number, start_term = (course["subjectAreaCode"], course["courseCatalogNumber"], course["courseStartTermCode"])
        category, number, start_term, units, requisites = parseCourse(category, number, start_term)
        courses.append((category, number, start_term, units, requisites))
    return courses

def parseGEInfo():
    ge_categories = [
        "GE-AH-LC",
        "GE-AH-VP",
        "GE-SC-HA",
        "GE-SC-SA",
        "GE-SI-LS"
    ]
    ge_categories = ge_categories[0:1]
    all_ge_courses = {}
    for ge_category in ge_categories:
        category, subcategory = ge_category.split("-")[1:]
        response = makeAPIRequest(getGEClassesURL(category, subcategory))
        ge_course_collection = response["geFoundationCategoryCourses"][0]["courseCollection"]
        all_ge_courses[ge_category] = parseCourseCollection(ge_course_collection)
    return all_ge_courses

#parseGEInfo()
#parseCourse("COM SCI", "0111", "12F")
#print(parseCourse("COM SCI", "111"))

# Manually parsed from https://catalog.registrar.ucla.edu/major/2021/ComputerScienceBS
required_courses = [
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
for course in required_courses:
    category = " ".join(course.split(" ")[:-1])
    number = course.split(" ")[-1]
    print("Getting course info for", category, number)
    print(parseCourse(category, number))