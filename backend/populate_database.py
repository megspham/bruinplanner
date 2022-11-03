import db_utils
from json_format import validate_json
import traceback

def convert_dars_to_json(dars_courses):
    """
    Converts a list of dars courses to a json object

    Parameters
    ----------
    dars_courses: List[Tuple]
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

    return dars_courses

def populateDBFromDars(dars_courses, user_name, email):
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
        print("Attempting to convert DARs courses to JSON and then add to database")
        # convert dars_courses a json object and then to a string
        json_dars_string = str(convert_dars_to_json(dars_courses))

        # validate the json string against the json schema
        valid_json_string = validate_json(json_dars_string)

        if not valid_json_string:
            print("Invalid JSON string")
            return False
        # try to add user to user table, updating the value of the calendar if the user already exists
        db_utils.execute("INSERT IGNORE INTO users (name, email, calendar) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (user_name, email, json_dars_string))
    except Exception as e: #Occurs when class with same name already exists
        traceback.print_exc()
        return False
    
    return True