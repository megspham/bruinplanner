def encodeNumber(number):
    """
    Converts course API number to course human readable number (e.g "0152A M" -> "M152A")

    Parameters
    ----------
    number : str
        human readable number

    Returns
    -------
    number : str
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

    Parameters
    ----------
    number : str
        course API number

    Returns
    -------
    number : str
        human readable number
    """
    number = number.strip("0")
    if number[-1] == "M":
        number = "M" + number.split(" ")[0]
    return number

def courseNameToDepartmentNumber(course_name):
    """
    Converts a course name into department and number.

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
    """
    department = " ".join(course_name.split(" ")[:-1])
    number = course_name.split(" ")[-1]
    number = encodeNumber(number)
    return department, number