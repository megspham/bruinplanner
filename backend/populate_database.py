import db_utils as db
from json_format import validate_json

def generateCalendar(courses):
    """
    Converts a list of tuples of courses to a calendar format

    Args:
        courses (pandas.DataFrame): Dataframe with information about courses
    
    Returns:
        JSON object containing the calendar
    """

    # TODO: add optional parameters such as historical courses, etc.

    calendar_dict = {}

    calendar_dict["calendar"] = {}
    calendar_dict["calendar"]["quarters"] = []

    for year in courses["Year"].unique():

        # get the value of Quarter column for the current year
        quarters = courses.loc[courses["Year"] == year, "Quarter"].values[0]

        for quarter in list(set(quarters)):
            # get the index of the first and last occurence of the current quarter in the quarters list
            first_index = quarters.index(quarter)
            last_index = len(quarters) - quarters[::-1].index(quarter) - 1


            # calendar_dict["calendar"]["quarters"].append({quarter + str(year): {}})
            
            quarter_dict = {}

            quarter_dict["year"] = year
            quarter_dict["quarter"] = quarter
            quarter_dict["courses"] = []

            # get the value of Course column for the current year and quarter
            courses_list = courses[(courses["Year"] == year)]["Course"].values[0][first_index:last_index+1]
            # print(courses_list)

            # get the value of Requirement column for the current year and quarter
            requirements_list = courses[(courses["Year"] == year)]["Requirement"].values[0][first_index:last_index+1]
            # print(requirements_list)

            # get the value of Department column for the current year and quarter
            departments_list = courses[(courses["Year"] == year)]["Department"].values[0][first_index:last_index+1]
            # print(departments_list)

            # get the value of Description column for the current year and quarter
            descriptions_list = courses[(courses["Year"] == year)]["Description"].values[0][first_index:last_index+1]
            # print(descriptions_list)

            # get the value of Units column for the current year and quarter
            units_list = courses[(courses["Year"] == year)]["Units"].values[0][first_index:last_index+1]
            # print(units_list)

            for i in range(len(courses_list)):
                # calendar_dict["calendar"]["quarters"][-1][quarter + str(year)]["courses"].append({"course" + str(i + 1): {}})
                
                course_dict = {}
                course_dict["name"] = str(courses_list[i]).replace("\"", "")
                course_dict["requirement"] = str(requirements_list[i]).replace("\"", "")
                course_dict["department"] = str(departments_list[i]).replace("\"", "")
                course_dict["description"] = str(descriptions_list[i]).replace("\"", "")
                course_dict["units"] = str(units_list[i]).replace("\"", "")

                quarter_dict["courses"].append({"course": course_dict})

            calendar_dict["calendar"]["quarters"].append({"quarter": quarter_dict})
    
    return calendar_dict

def updateUserCalendar(courses, id):
    """
    Attempts to add info about previously taken courses into the given user's table.

    Args:
        courses (pandas.DataFrame): Dataframe with information about courses
        id (int): ID of the user whose table is being updated

    Returns:
        True if the update was successful, False otherwise
    """   
 
    try:
        print("Attempting to convert courses list into a calendar format and then add to database")
        
        # convert dars_courses into a json object and then to a string
        calendar = str(generateCalendar(courses)).replace("'", '"')

        # validate the json string against the json schema
        valid_calendar_string = validate_json(calendar)

        if not valid_calendar_string:
            print("Invalid Calendar string")
            return False
        # try to add user to user table, updating the value of the calendar if the user already exists
        db.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", (id, calendar, calendar))
    except Exception as e:
        print("Error: " + str(e))
        return False
    
    return True