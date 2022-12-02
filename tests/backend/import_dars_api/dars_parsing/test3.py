import sys
sys.path.append('../../../../backend')
import parse_dars

test3_html = open('test_data/test2.html', 'r', encoding='utf-8')
test3_html_data = test3_html.read() 

dars_courses = parse_dars.parse_dars(test3_html, 'Fall', 2019)
# assert that dars_courses is a empty dataframe
assert dars_courses.empty, 'Assertion Error: dars_courses is not empty'
print(dars_courses)