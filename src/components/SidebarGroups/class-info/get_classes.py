import requests
import json

def sendRequest(requestBody):
    headers =  { 'Content-Type': 'application/json' }
    response =  requests.post("http://127.0.0.1:8000/api/getClasses", data=json.dumps(requestBody), headers=headers)
    return json.dumps(response.json())

def getClasses(type_list = None, department_list = None, min_units = None, max_units = None, classes_taken = None):
    requestBody = {
        "type_list": type_list,
        "department_list": department_list,
        "min_units": min_units,
        "max_units": max_units,
        "classes_taken": classes_taken
    }
    return sendRequest(requestBody)

def get_all_categories():
    categories = [
        'GE-AH-LC',
        'GE-AH-VP',
        'GE-AH-PL',
        'GE-SC-HA',
        'GE-SC-SA',
        'GE-SI-LS',
        'cs-elective'
    ]
    for category in categories:
        classes = getClasses([category], None, 0, 99, None)
        path = category + '.json'
        f = open(path, "a")
        f.write(classes)
        f.close()

if __name__ == "__main__":
    get_all_categories()