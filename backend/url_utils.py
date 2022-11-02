import json
import requests
from macros import *

def makeAPIRequest(URL):
    """
    Makes an API request to UCLA course API, sending URL.

    Parameters
    ----------
    URL: str
        API request to make to UCLA courses/classes API

    Returns
    -------
    r_j: Dictionary
        JSON response to API call
    """
    s = requests.Session()
    s.headers.update(HEADERS)
    r = s.get(URL)
    #print(URL)
    #print(r)
    try:
        r_j = json.loads(r.text)
    except:
        r_j = None
    return r_j

def getGEClassesURL(category, subcategory):
    """
    Generates URL to query courses API to get list of GEs.

    Parameters
    ----------
    category: str
        GE category (e.g. AH)
    subcategory: str
        GE subcategory (e.g. LC)

    Returns
    -------
    url: str
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/gefoundations/{}/{}/gefoundationcategorycourses/v1?PageSize=10".format(category, subcategory)
    return URL

def getCourseDetailURL(category, number, start_term):
    """
    Generates URL to query courses API to details about a certain course.

    Parameters
    ----------
    category: str
        class category
    number: str
        class number
    start_term: str
        class start term

    Returns
    -------
    url: str
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/coursedetail/v1".format(category, number, start_term)
    return URL

def getCourseRequisitesURL(category, number, start_term):
    """
    Generates URL to query courses API to get requisites for a certain course.

    Parameters
    ----------
    category: str
        class category
    number: str
        class number
    start_term: str
        class start term

    Returns
    -------
    url: str
        Generated URL
    """
    URL =  "https://api.ucla.edu/sis/courses/{}/{}/{}/courserequisites/v1".format(category, number, start_term)
    return URL

def getCourseURL(category, number):
    """
    Generates URL to query courses API to get all courses with given category and start_term.
    Each course may have different start term.

    Parameters
    ----------
    category: str
        class category
    number: str
        class number

    Returns
    -------
    url: str
        Generated URL
    """
    URL = "https://api.ucla.edu/sis/courses/v1?subjectAreaCode={}&courseCatalogNumber={}".format(category, number)
    return URL