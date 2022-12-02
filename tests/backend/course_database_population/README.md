# Course Database Population Tests

## Test 1

### Objective

This test is intended to check whether a row can successfully be added to the course database. It adds a course to the database, checks that it has been added, then deletes it.

### Input

- SQL command to insert course into database: INSERT INTO courses (type, name, department, number, start_term, units, class_requisites, historical_offerings) VALUES (None, "test-type", "COM SCI", "9999", "FA00", 4.0, "COMSCI0031", None)
- SQL command to query courses from database: SELECT * FROM courses WHERE name='test-type';

### Expected Output

[(None, 'test-type', 'COM SCI', '9999', 'FA00', 4, 'COMSCI0031', None)]

### Actual Output

[(None, 'test-type', 'COM SCI', '9999', 'FA00', 4, 'COMSCI0031', None)]
