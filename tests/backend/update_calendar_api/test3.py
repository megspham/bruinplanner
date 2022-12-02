import sys
sys.path.append('../../../backend')
import backend_REST_API
import db_utils

test3_calendar = '''{
    "calendar": 
    {
        "quarters": 
        [
            {
                "quarter": 
                {
                }
            }
        ]
    }
}'''

s = backend_REST_API.updateCalendar("test3_user", test3_calendar)
# remove the test user from the database
db_utils.execute("DELETE FROM users WHERE id='test3_user';")

print(s)

assert s != None, "Assertion Error: updateCalendar() should return None"