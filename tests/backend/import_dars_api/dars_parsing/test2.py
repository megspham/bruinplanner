import sys
sys.path.append('../../../../backend')
import parse_dars

test2_html = open('test_data/test2.html', 'r', encoding='utf-8')
test2_html_data = test2_html.read() 

dars_courses = parse_dars.parse_dars(test2_html_data, 'Fall', 2019)
