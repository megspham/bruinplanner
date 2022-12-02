import sys
sys.path.append('../../../../backend')
import parse_dars
from populate_database import generateCalendar
from json_format import validate_json
import db_utils
import json

# create a user in the users table and add a test string to the calendar column
db_utils.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", ("\'test2_user\'", "test-string", "test-string"))

# get the calendar column for the user with id \'test2_user\'
results = db_utils.execute("SELECT calendar FROM users WHERE id=%s;", ("\'test2_user\'",))

# print the calendar column
print(results[0][0])

# open the html file containing the dars data
test1_html = open('test_data/test.html', 'r', encoding='utf-8')
test1_html_data = test1_html.read() 

# parse the html data
dars_courses = parse_dars.parse_dars(test1_html_data, 'Fall', 2019)

# convert dars_courses into a json object and then to a string
calendar = str(generateCalendar(dars_courses)).replace("'", '"')

# validate the json string against the json schema
validate_json(calendar)

# try to add user to user table, updating the value of the calendar if the user already exists
db_utils.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", ("\'test2_user\'", calendar, calendar))

# get the calendar column for the user with id \'test2_user\'
results = db_utils.execute("SELECT calendar FROM users WHERE id=%s;", ("\'test2_user\'",))

# print the calendar column
print(json.dumps(json.loads(results[0][0]), indent=2))

# Cleanup
db_utils.execute("DELETE FROM users WHERE id=\'test2_user\';")