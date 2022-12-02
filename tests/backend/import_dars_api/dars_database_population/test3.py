import sys
sys.path.append('../../../../backend')
import parse_dars
from populate_database import generateCalendar
from json_format import validate_json
import db_utils
import json

try:
    # delete the user with id \'test3_user\' from the users table
    db_utils.execute("DELETE FROM users WHERE id='test3_user';")

    # try to grab the user with id \'test3_user\', catching the exception
    results = db_utils.execute("SELECT FROM users WHERE id='test3_user';")
except:
    print("User \'test3_user\' does not exist in the users table")

# open the html file containing the dars data
test1_html = open('test_data/test.html', 'r', encoding='utf-8')
test1_html_data = test1_html.read() 

# parse the html data
dars_courses = parse_dars.parse_dars(test1_html_data, 'Fall', 2019)

# convert dars_courses into a json object and then to a string
calendar = str(generateCalendar(dars_courses)).replace("'", '"')

# validate the json string against the json schema
validate_json(calendar)

# try to add user to user table
db_utils.execute("INSERT IGNORE INTO users (id, calendar) VALUES (%s, %s) ON DUPLICATE KEY UPDATE calendar=%s;", ("test3_user", calendar, calendar))

# get the calendar column for the user with id 001
results = db_utils.execute("SELECT calendar FROM users WHERE id='test3_user'")

# print the calendar column
print(json.dumps(json.loads(results[0][0]), indent=2))

# Cleanup
db_utils.execute("DELETE FROM users WHERE id='test3_user';")