import sys
sys.path.append('../../backend')

import db_utils
import populate_courses

course_info = (None, "test-type", "COM SCI", "9999", "FA00", 4.0, "COMSCI0031", None)
db_utils.execute("INSERT INTO courses (type, name, department, number, start_term, units, class_requisites, historical_offerings) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", course_info)
results = db_utils.execute("SELECT * FROM courses WHERE name=\'test-type\';")
assert results==[(None, 'test-type', 'COM SCI', '9999', 'FA00', 4, 'COMSCI0031', None)]

# Cleanup
db_utils.execute("DELETE FROM courses WHERE name=\'test-type\';")

#print(results)
