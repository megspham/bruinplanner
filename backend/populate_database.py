import db_utils as db
from json_format import validate_json
import traceback

def generateCalendar(courses):
    """
    Converts a list of tuples of courses to a calendar format

    Parameters
    ----------
    courses: List[Tuple]
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

    return courses

def updateUserCalendar(courses, name, email):
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
        print("Attempting to convert courses list into a calendar format and then add to database")
        
        # convert dars_courses into a json object and then to a string
        calendar = str(generateCalendar(courses))

        # validate the json string against the json schema
        valid_calendar_string = validate_json(calendar)

        if not valid_calendar_string:
            print("Invalid Calendar string")
            return False
        # try to add user to user table, updating the value of the calendar if the user already exists
        db.execute("INSERT IGNORE INTO users (name, email, calendar) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (name, email, valid_calendar_string))
    except Exception as e:
        traceback.print_exc()
        return False
    
    return True