Module populate_database
========================

Functions
---------

    
`generateCalendar(courses)`
:   Converts a list of tuples of courses to a calendar format
    
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
    json: JSON
        JSON object containing the calendar

    
`updateUserCalendar(courses, name, email)`
:   Attempts to add info about previously taken courses into the given user's table.
    
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