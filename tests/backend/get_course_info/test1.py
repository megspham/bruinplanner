import sys
sys.path.append('../../../backend')
import populate_courses

course_info = populate_courses.parseCourse("COM SCI", "0032")

assert course_info == (None, 'COM SCI 32', 'COM SCI', '0032', '06F', 4.0, 'COM SCI 31', None)
