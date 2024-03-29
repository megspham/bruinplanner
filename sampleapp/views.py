from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))
import backend_REST_API

# Create your views here.
@csrf_exempt
def addUser_view(request):
    request_body = json.loads(request.body)
    id = request_body["id"]

    success = backend_REST_API.addUser(id)
    response = JsonResponse({"success": success})
    response["Access-Control-Allow-Origin"] = "*"
    return response


@csrf_exempt
def getClasses_view(request):
    request_body = json.loads(request.body)
    type_list = request_body["type_list"]
    department_list = request_body["department_list"]
    min_units = request_body["min_units"]
    max_units = request_body["max_units"]
    classes_taken = [tuple(c) for c in request_body["classes_taken"]] if request_body["classes_taken"] is not None else None
    
    classes = backend_REST_API.getClasses(type_list=type_list, department_list=department_list, min_units=min_units, max_units=max_units, classes_taken=classes_taken)
    print(classes)
    response = JsonResponse({"classes": classes})
    response["Access-Control-Allow-Origin"] = "*"
    return response

# id, start_quarter, start_year, dars_file
@csrf_exempt
def importDars_view(request):
    request_body = json.loads(request.body)
    id = request_body["id"]
    start = request_body["start_quarter"]
    year = int(request_body["start_year"])
    file = request_body["dars_file"]

    success = backend_REST_API.importDARS(id, start, year, file)

    if (success):
        # also return the calendar
        calendar = backend_REST_API.getCalendar(id)

        response = JsonResponse(json.loads(calendar))
        response["Access-Control-Allow-Origin"] = "*"
    else:
        print("Import DARS unsuccessful. Sending error to client...")
        response = JsonResponse(json.loads("{}"))
    return response

@csrf_exempt
def getCalendar_view(request):
    request_body = json.loads(request.body)
    id = request_body["id"]

    calendar = backend_REST_API.getCalendar(id)

    if calendar is None:
        response = JsonResponse({})
    else:
        response = JsonResponse(json.loads(calendar))
    response["Access-Control-Allow-Origin"] = "*"
    return response

@csrf_exempt
def updateCalendar_view(request):
    request_body = json.loads(request.body)
    id = request_body["id"]
    calendar = request_body["calendar"]

    calendar = backend_REST_API.updateCalendar(id, calendar)

    if calendar is None:
        response = JsonResponse({})
    else:
        response = JsonResponse(json.loads(calendar))

    response["Access-Control-Allow-Origin"] = "*"
    return response