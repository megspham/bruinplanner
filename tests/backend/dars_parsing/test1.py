import sys
sys.path.append('../../../backend')
import parse_dars

test1_html = open('test_data/test1.html', 'r', encoding='utf-8')
test1_html_data = test1_html.read() 

dars_courses = parse_dars.parse_dars(test1_html_data, 'Fall', 2019)

assert dars_courses['Year'][0] == 22, 'Assertion Error: incorrect year'
assert dars_courses['Quarter'][0][0] == 'WI', 'Assertion Error: incorrect quarter'
assert dars_courses['Course'][0][0] == 'COMSCICM121', 'Assertion Error: incorrect course'
assert dars_courses['Requirement'][0][0] == 'CS_ST_ELECTIVES', 'Assertion Error: incorrect requirement'
assert dars_courses['Department'][0][0] == 'COM SCI',  'Assertion Error: incorrect department'
assert dars_courses['Units'][0][0] == 4.0, 'Assertion Error: incorrect units'

print(dars_courses)