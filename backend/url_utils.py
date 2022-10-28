import json
import requests

# Note: BEARER expires roughly every half hour
# Update BEARER by logging into https://developer.api.ucla.edu/api/261#/Classes/ extracting headers from curl command for some request
BEARER = '5xKa9AiPh9diZkqJTh3cxBJxTRA6'
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
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&courseCatalogNumber={}".format(category, number)
    return URL

def getCourseRequisitesURL(category, number, start_term):
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/courserequisites/v1".format(category, number, start_term)
    return URL