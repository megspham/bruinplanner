import sys
sys.path.append('../../backend')
import parse_dars

dars_courses = parse_dars.parse_dars('test_data/test1.html', 'FA', 19)

assert dars_courses == [('CS_ST_ELECTIVES', 'COMSCICM121', 'COM SCI', 'INTR-BIOINFORMATICS', 'WI', 22, 4.0)], 'Assertion Error: test1.py'
print(dars_courses)