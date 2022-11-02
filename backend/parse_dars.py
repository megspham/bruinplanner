import re
import bs4
import pandas as pd
import populate_database
import argparse

# list of requirement categories

requirement_categories_mapping = {
	'ENTRY-LEVEL WRITING/ESL': 'ENTRY_WRITING',
	'AMERICAN HISTORY & INSTITUTIONS': 'AMER_HIST',	
	'WRITING I': 'WRITING_1',
	'FOUNDATIONS OF THE ARTS': 'GE_AH',
	'FOUNDATIONS OF SOCIETY' : 'GE_SC',
	'FOUNDATIONS OF SCIENTIFIC INQUIRY' : 'GE_SI',
	'LOWER DIVISION COMPUTER SCIENCE' : 'CS_LOWER_DIV',
	'LOWER DIVISION MATHEMATICS' : 'MATH_LOWER_DIV',
	'LOWER DIVISION PHYSICS' : 'PHYSICS_LOWER_DIV',
	'COMPUTER SCIENCE REQUIRED': 'CS_REQUIRED',
	'TECHNICAL BREADTH AREA': 'CS_TECHNICAL_BREADTH',
	'SCIENCE-TECHNOLOGY ELECTIVES': 'CS_ST_ELECTIVES',
	'ENGINEERING ETHICS': 'ENGR_ETHICS',
	}

def parse_dars(dars_file, start_quarter, start_year):
	"""
	Parses a DARS report, returning the corresponding courses list.

	Parameters
	----------
	dars_file : str
		The path to the DARS report file
	start_quarter : str
		The start quarter of the DARS report
	start_year : int
		The start year of the DARS report

	Returns
	-------
	courses : List[Tuple]
		List of tuples, where each tuple contains information about a previously taken course:
		
			- Course Name
			- Requirement
			- Course Description
			- Quarter
			- Year
			- Units
	"""
	
	quarter_to_number = {'WI': 1, 'SP': 2, 'SU': 3, 'FA': 4}

	with open(dars_file, 'r', encoding="ISO-8859-1") as f:
		soup = bs4.BeautifulSoup(f, 'html.parser')    

	requirements = soup.find_all('div', class_='reqTitle')
	req_dividers = soup.find_all('div', class_='auditSubrequirements')

	data = []

	for index, req in enumerate(requirements):

		old_req = None
		for cat, abbr in requirement_categories_mapping.items():
			if cat in req.text:
				old_req = abbr
				break

		if old_req is None:
			continue
		else:
			req = old_req

		table_to_req_map = {}

		if req.startswith('GE_'):
			ge_type = req_dividers[index].find_all('span', class_='subreqTitle')

			for ge in ge_type:

				if ge.find_next_sibling('table', class_='completedCourses') is not None:
					# print(ge.find_next_sibling('table', class_='completedCourses').find('tr', class_ = 'takenCourse'))

					ge_subreq = ge.text.strip()
					ge_abbrev = "".join(e[0] for e in ge_subreq.split() if e[0] != '&') # add [:-1] to remove the abbreviation for the word Analysis

					table_to_req_map[req + '_' + ge_abbrev] = ge.find_next_sibling('table', class_='completedCourses')

					# print(ge.text, ':', req + '_' + ge_abbrev)
		else:

			tables = req_dividers[index].find_all('table', class_='completedCourses')

			# edge cases
			if len(tables) == 3 and req == 'CS_REQUIRED': # case where cs 130 is taken, we have a 3rd table just for it that we don't want 
				tables = tables[1:]



			for i in range(len(tables)):

				if req == 'CS_REQUIRED':
					if i == 0: # first table would be the required courses
						table_to_req_map['CS_REQUIRED'] = tables[i]
					if i == 1: # the second table would the electives
						table_to_req_map['CS_ELECTIVES'] = tables[i]
					continue
				if req == 'PHYSICS_LOWER_DIV':
					if req not in table_to_req_map:
						table_to_req_map[req] = tables[i]
					else:
						table_to_req_map[req + str(i)] = tables[i]
				else:
					table_to_req_map[req] = tables[i]			

		if not table_to_req_map:
			continue
		else:

			for requirement, table in table_to_req_map.items():

				if req == 'PHYSICS_LOWER_DIV':
					requirement = 'PHYSICS_LOWER_DIV'

				for course in table.children:

					if type(course) is bs4.element.NavigableString: # table.children is intermixed with NavigableStrings that don't contain the course information
						continue

					attributes = course.find_all('td')

					# second attribute is the course
					course = attributes[1].text.strip()

					# strip all the whitespace
					course = re.sub(r'\s+', '', course)

					# fourth attribute is the grade
					grade = attributes[3].text.strip()

					# sixth attribute is the description
					description_lines = attributes[5].find('table').findAll('td', {'class': 'descLine'})

					course_description = description_lines[0].text.strip()

					# check if there is another description line (which may have information about the course it is alternate for - more useful name)
					if len(description_lines) > 1:

						#loop through all the description lines
						for desc_line in description_lines[0:]:
							if 'ALTERNATE' in desc_line.text and '_' not in desc_line.text: # '_' only seems to be present in weird alt course descriptions (don't use) EX: X201_ELECTIVE_C

								# remove the words ALTERNATE and CRS: from the description line
								alt_course = desc_line.text.replace('ALTERNATE CRS:', '').strip()

								# strip all the whitespace
								course = re.sub(r'\s+', '', alt_course)
								break

					try:
						# first attribute is the term
						term = attributes[0].text.strip()

						quarter, year = term[:2], int(term[2:])

						# get numeric representation of quarter
						term_num = quarter_to_number[quarter] + (year - start_year) * 4

						if quarter != 'FA' and quarter != 'WI' and quarter != 'SP' and quarter != 'SU':
							continue
					except:
						continue
					
					try:
						# third attribute is the units
						units = attributes[2].text.strip()
						units = float(units)
					except:
						continue

					data.append([requirement, course, course_description, quarter, year, units, term_num])
			
	courses = pd.DataFrame(data, columns = ['Requirement', 'Course', 'Description', 'Quarter', 'Year', 'Units', 'Term_Num'])

	courses = courses[courses['Units'] > 0.0]
	courses = courses[courses['Year'] >= start_year]
	courses = courses[courses['Term_Num'] >= quarter_to_number[start_quarter]]

	courses = courses.sort_values(by=['Term_Num']).drop_duplicates(subset = ['Course'], keep='first').drop(columns=['Term_Num']).reset_index(drop=True)

	# convert dataframe to list of tuples for easier population of database
	courses = list(courses.itertuples(index=False, name=None)) 

	return courses



def main():
	parser = argparse.ArgumentParser(description='Parse DARS report')
	parser.add_argument('--file', help='DARS report file')
	parser.add_argument('--start_quarter', help='Start term', type = str, default = 'FA')
	parser.add_argument('--start_year', help='Start year', type=int)
	
	args = parser.parse_args()
	file = args.file
	start_quarter = args.start_quarter
	start_year = args.start_year

	parse_dars(file, start_quarter, start_year)

	

if __name__ == "__main__":
	main()
