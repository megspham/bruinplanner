import sys
sys.path.append('../../backend')
import parse_dars

dars_courses = parse_dars.parse_dars('test_data/test3.html', 'FA', 19)

assert dars_courses == [], 'Assertion Error: test3.py'
print(dars_courses)