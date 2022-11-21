
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
                                "name":
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
                                                "name":
                                                {
                                                    "type": "string"
                                                },
                                                "department":
                                                {
                                                    "type": "string"
                                                },
                                                "description":
                                                {
                                                    "type": "string"
                                                },
                                                "units":
                                                {
                                                    "type": "float"
                                                },
                                                "requirement":
                                                {
                                                    "type": "string"
                                                },
                                                "pre_requisites":
                                                {
                                                    "type": "array",
                                                    "items":
                                                    {
                                                        "pre_requisite_name":
                                                        {
                                                            "type": "string"
                                                        }
                                                    }
                                                },
                                                "historical_offerings":
                                                {
                                                    "type": "array",
                                                    "items":
                                                    {
                                                        "historical_offering_term":
                                                        {
                                                            "type": "string"
                                                        }
                                                    }
                                                },
                                                "unsatisfied_pre_requisites":
                                                {
                                                    "type": "array",
                                                    "items":
                                                    {
                                                        "name":
                                                        {
                                                            "type": "string"
                                                        }
                                                    }
                                                }
                                            },
                                            "required": ["name", "units", "requirement"]
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
                "calendar": 
                {
                    "quarters": 
                    [
                        {
                            "quarter": 
                            {
                                "year": 2019,
                                "name": "FA",
                                "courses": 
                                [
                                    {
                                        "course": 
                                        {
                                            "name": "CS 31",
                                            "department": "CS",
                                            "description": "Introduction to C++",
                                            "units": 4.0,
                                            "requirement": "CS",
                                            "historical_offerings":
                                            [
                                                {
                                                    "historical_offering_term": "SP 2019"
                                                },
                                                {
                                                    "historical_offering_term": "WI 2019"
                                                },
                                                {
                                                    "historical_offering_term": "FA 2018"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "quarter": 
                            {
                                "year": 2020,
                                "name": "WI",
                                "courses": 
                                [
                                    {
                                        "course": 
                                        {
                                            "name": "CS 32",
                                            "department": "CS",
                                            "description": "Data Structures and Algorithms",
                                            "units": 4.0,
                                            "requirement": "CS",
                                            "pre_requisites": 
                                            [
                                                {
                                                    "pre_requisite_name": "CS 31"
                                                }
                                            ],
                                            "historical_offerings":
                                            [
                                                {
                                                    "historical_offering_term": "FA 2019"
                                                },
                                                {
                                                    "historical_offering_term": "SP 2019"
                                                },
                                                {
                                                    "historical_offering_term": "WI 2018"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "quarter": 
                            {
                                "year": 2020,
                                "name": "SP",
                                "courses": 
                                [
                                    {
                                        "course": 
                                        {
                                            "name": "CS 33",
                                            "department": "CS",
                                            "description": "Intro to Computer Architecture",
                                            "units": 4.0,
                                            "requirement": "CS",
                                            "pre_requisites": 
                                            [
                                                {
                                                    "pre_requisite_name": "CS 31"
                                                }
                                            ],
                                            "historical_offerings":
                                            [
                                                {
                                                    "historical_offering_term": "WI 2020"
                                                },
                                                {
                                                    "historical_offering_term": "FA 2019"
                                                },
                                                {
                                                    "historical_offering_term": "SP 2018"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "course": 
                                        {
                                            "name": "CS 111",
                                            "department": "CS",
                                            "description": "Operating Systems Principles",
                                            "units": 4.0,
                                            "requirement": "CS",
                                            "pre_requisites": 
                                            [
                                                {
                                                    "pre_requisite_name": "CS 32"
                                                },
                                                {
                                                    "pre_requisite_name": "CS 33"
                                                },
                                                {
                                                    "pre_requisite_name": "CS 35L"
                                                }
                                            ],
                                            "historical_offerings":
                                            [
                                                {
                                                    "historical_offering_term": "WI 2020"
                                                },
                                                {
                                                    "historical_offering_term": "FA 2019"
                                                },
                                                {
                                                    "historical_offering_term": "SP 2018"
                                                }
                                            ]
                                        }
                                    }
                                ]
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
