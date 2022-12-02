import sys
sys.path.append('../../../backend')
import backend_REST_API
import db_utils

test2_calendar = '''{
    "calendar": 
    {
        "quarters": 
        [
            [
                "quarter": 
                {
                    "year": 2019,
                    "quarter": "FA",
                    "courses": 
                    [
                        {
                            "course": 
                            {
                                "name": "CS 31",
                                "department": "CS",
                                "description": "Introduction to C++",
                                "units": 4.0,
                                "requirement": "CS",
                                "historical_offerings":
                                [
                                    {
                                        "historical_offering_term": "SP 2019"
                                    },
                                    {
                                        "historical_offering_term": "WI 2019"
                                    },
                                    {
                                        "historical_offering_term": "FA 2018"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        ]
    }
}'''

s = backend_REST_API.updateCalendar("test2_user", test2_calendar)

# remove the test user from the database if anything went wrong
db_utils.execute("DELETE FROM users WHERE id='test2_user';")

assert s == None, "Assertion Error: updateCalendar() should return None"