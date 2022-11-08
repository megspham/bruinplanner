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
def getClasses_view(request):
    request_body = json.loads(request.body)
    type_list = request_body["type_list"]
    department_list = request_body["department_list"]
    min_units = request_body["min_units"]
    max_units = request_body["max_units"]
    classes_taken = [tuple(c) for c in request_body["classes_taken"]] if request_body["classes_taken"] is not None else None
    
    classes = backend_REST_API.getClasses(type_list=type_list, department_list=department_list, min_units=min_units, max_units=max_units, classes_taken=classes_taken)
    print(classes)
    return JsonResponse({"classes": classes})