Module parse_dars
=================

Functions
---------

    
`parse_dars(dars_file, start_quarter, start_year)`
:   Parses a DARS report, returning the corresponding courses list.
    
    Parameters
    ----------
    dars_file : str
            The path to the DARS report file
    start_quarter : str
            The start quarter of the DARS report
    start_year : int
            The start year of the DARS report
    
    Returns
    -------
    courses : List[Tuple]
            List of tuples, where each tuple contains information about a previously taken course:
            
                    - Requirement
                    - Course Name
                    - Course Department
                    - Course Description
                    - Quarter
                    - Year
                    - Units