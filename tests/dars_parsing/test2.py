import sys
sys.path.append('../../backend')
import parse_dars

dars_courses = parse_dars.parse_dars('test_data/test2.html', 'FA', 19)
