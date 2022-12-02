import sys
sys.path.append('../../../backend')
import backend_REST_API
import db_utils

test1_calendar = '''{
    "calendar": 
    {
        "quarters": 
        [
            {
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
            }
        ]
    }
}'''

s = backend_REST_API.updateCalendar("test1_user", test1_calendar)

# select the test1_user's calendar from the database
calendar = db_utils.execute("SELECT calendar FROM users WHERE id='test1_user';")
print(calendar[0][0])

# remove the test user from the database
db_utils.execute("DELETE FROM users WHERE id='test1_user';")