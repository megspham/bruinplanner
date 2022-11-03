
import json
import jsonschema

# JSON Schema for the BruinPlanner API
schema = '''{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://example.com/product.schema.json",
    "title": "User Calendar",
    "description": "Calendar of courses taken by a user",
    "type": "object",
    "properties": 
    {
        "calendar":
        {
            "type": "object",
            "properties": 
            {
                "quarters": 
                {
                    "type": "array",
                    "items":
                    {
                        "quarter":
                        {
                            "type": "object",
                            "properties":
                            {
                                "year":
                                {
                                    "type": "int"
                                },
                                "quarter_name":
                                {
                                    "type": "string",
                                    "enum": ["WI", "SP", "SU", "FA"]
                                },
                                "courses":
                                {
                                    "type" : "array",
                                    "items":
                                    {
                                        "course":
                                        {
                                            "type": "object",
                                            "properties":
                                            {
                                                "course_name":
                                                {
                                                    "type": "string"
                                                },
                                                "course_department":
                                                {
                                                    "type": "string"
                                                },
                                                "course_description":
                                                {
                                                    "type": "string"
                                                },
                                                "course_units":
                                                {
                                                    "type": "float"
                                                },
                                                "course_requirement":
                                                {
                                                    "type": "string"
                                                },
                                                "course_pre_requisites":
                                                {
                                                    "type": "array",
                                                    "items":
                                                    {
                                                        "pre_requisite_name":
                                                        {
                                                            "type": "string"
                                                        }
                                                    }
                                                }
                                            },
                                            "required": ["course_name", "course_units", "course_requirement"]
                                        }
                                    },
                                    "required": ["course"]
                                }
                            }
                        }
                    }
                }
            },
            "required": ["quarters"]
        }
    },
    "required": ["calendar"]
}'''

# minimal example of how the JSON format would be used
example = '''{
	"calendar": {
		"quarters": [{
				"quarter": {
					"year": 2020,
					"quarter_name": "WI",
					"courses": [{
						"course": {
							"course_name": "CS 32",
							"course_department": "CS",
							"course_description": "Data Structures and Algorithms",
							"course_units": 4.0,
							"course_requirement": "CS",
							"course_pre_requisites": [
                                {
								    "pre_requisite_name": "CS 31"
							    }
                            ]
						}
					}]
				}
			},
			{
				"quarter2": {
					"year": 2020,
					"quarter_name": "SP",
					"courses": [{
						"course": {
							"course_name": "CS 33",
							"course_department": "CS",
							"course_description": "Intro to Computer Architecture",
							"course_units": 4.0,
							"course_requirement": "CS",
							"course_pre_requisites": [
                                {
								    "pre_requisite_name": "CS 31"
							    }
                            ]
						}
					}]
				}
			}
		]
	}
}'''

def validate_json(json_string):
    """
    Validates a JSON string against the BruinPlanner API JSON schema.
    
    Parameters
    ----------
        json_string : str
            JSON string to validate
    
    Returns
    -------
        bool: True if the JSON string is valid, False otherwise

    """
    try:
        json_object = json.loads(json_string)
        json_schema = json.loads(schema)
    except ValueError as e:
        return False
    try:
        jsonschema.validate(instance=json_object, schema=json_schema)
        print("JSON is valid!")
        return True
    except jsonschema.exceptions.ValidationError as e:
        return False

if __name__ == "__main__":
    validate_json(example)
