import sys
sys.path.append('../../../backend')
import backend_REST_API
import db_utils
import json_format
import json

test4_calendar = json_format.example

calendar = backend_REST_API.updateCalendar("test4_user", test4_calendar)
# remove the test user from the database
db_utils.execute("DELETE FROM users WHERE id='test4_user';")

print(json.dumps(json.loads(calendar), indent=2))

assert calendar != None, "Assertion Error: updateCalendar() should return None"