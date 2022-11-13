Module populate_courses
=======================

Functions
---------

    
`addClass(course_info)`
:   Attempts to add info about a certain class into database.
    
    Parameters
    ----------
    course_info: Tuple
        Tuple containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)
    
    Returns
    -------
    success: bool
        Whether course info could be successfully added

    
`addClasses(course_infos)`
:   Attempts to add info about a list of classes into database.
    
    Parameters
    ----------
    course_info: Tuple
        List of tuples, each containing (type_, name, department, number, start_term, units, class_requisites, historical_offerings)
    
    Returns
    -------
    success: List[bool]
        Whether all course infos could be successfully added

    
`courseNameToDepartmentNumber(course_name)`
:   Converts a course name into department and number.
    
    Parameters
    ----------
    course_name: str
        name of course in question
    
    Returns
    -------
    department: str
        department for course
    number: str
        number for course

    
`decodeNumber(number)`
:   Converts course human readable number to course API number (e.g "M152A" -> "0152A M")
    
    Parameters
    ----------
    number : str
        course API number
    
    Returns
    -------
    number : str
        human readable number

    
`encodeNumber(number)`
:   Converts course API number to course human readable number (e.g "0152A M" -> "M152A")
    
    Parameters
    ----------
    number : str
        human readable number
    
    Returns
    -------
    number : str
        course API number

    
`getCourseDetailURL(category, number, start_term)`
:   Generates URL to query courses API to details about a certain course.
    
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

    
`getCourseLatestStartTerm(department, number)`
:   Gets latest start term for a particular course
    
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

    
`getCourseRequisitesURL(category, number, start_term)`
:   Generates URL to query courses API to get requisites for a certain course.
    
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

    
`getCourseURL(category, number)`
:   Generates URL to query courses API to get all courses with given category and start_term.
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

    
`getEntries()`
:   Returns all classes in the database
    
    Returns
    -------
    entries: List[Tuple]
        List of all classes in the database.

    
`getGEClassesURL(category, subcategory)`
:   Generates URL to query courses API to get list of GEs.
    
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

    
`makeAPIRequest(URL)`
:   Makes an API request to UCLA course API, sending URL.
    
    Parameters
    ----------
    URL: str
        API request to make to UCLA courses/classes API
    
    Returns
    -------
    r_j: Dictionary
        JSON response to API call

    
`parseCourse(department, number, start_term=None, type_=None)`
:   Parses department name and number (and optionally start_term) of a certain course to obtain course info.
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

    
`parseCourses(courses)`
:   Parses department name and number (and optionally start_term) of a list of courses to obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Parameters
    ----------
    courses: List[(department, number, [start_term, [type_]])]
        List of courses to be parsed using parseCourse
    
    Returns
    -------
    courseInfos: List[(type_, name, department, number, start_term, units, class_requisites, historical_offerings)]
        List of courseInfo tuples, each of which corresponds to a course in courses

    
`parseCoursesByName(course_names_types)`
:   Parses list of course names into a list containing obtain course info for each.
    courseInfos is a list of tuples, each containing: course type, course name, department, course number, course start term, course units, course requisites, historical offerings.
    
    Parameters
    ----------
    course_names_types: List[Tuple(course_name, course_type)]
        List of courses to be parsed using parseCourses
    
    Returns
    -------
    courseInfos: List[(type_, name, department, number, start_term, units, class_requisites, historical_offerings)]
        List of courseInfo tuples, each of which corresponds to a course in courses

    
`parseGEs(categories)`
:   Parses list of GE categories into a list of tuples, each being a course info.
    
    Parameters
    ----------
    categories: List[str]
        List of GE categories to be parsed
    
    Returns
    -------
    ge_course_infos: List[Tuple]
        List of courseInfo tuples, each of which corresponds to a GE course

    
`populateCourses()`
:   

    
`recursivelyAddPrereqs()`
:   Recursively adds all prereqs for all classes in the database. Repeats until no more prereqs have been added.
    
    Returns
    -------
    classes: List[(tuple)]
        List of all prerequisites added