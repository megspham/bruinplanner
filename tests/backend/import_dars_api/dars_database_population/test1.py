import sys
sys.path.append('../../../../backend')
import parse_dars
from populate_database import generateCalendar
from json_format import validate_json
import json

test1_html = open('test_data/test.html', 'r', encoding='utf-8')
test1_html_data = test1_html.read() 

dars_courses = parse_dars.parse_dars(test1_html_data, 'Fall', 2019)

calendar = str(generateCalendar(dars_courses)).replace("'", '"')

validate_json(calendar)

print(json.dumps(json.loads(calendar), indent=2))