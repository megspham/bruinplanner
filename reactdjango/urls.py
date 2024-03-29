"""reactdjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
  https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
  1. Add an import:  from my_app import views
  2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
  1. Add an import:  from other_app.views import Home
  2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
  1. Import the include() function: from django.urls import include, path
  2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView

from sampleapp.views import addUser_view, getClasses_view, importDars_view, getCalendar_view, updateCalendar_view

urlpatterns = [
  path('admin/', admin.site.urls),
  # path('api/', include('sampleapp.urls')),
  path('api/addUser', addUser_view),
  path('api/getClasses', getClasses_view),
  path('api/importDars', importDars_view),
  path('api/getCalendar', getCalendar_view),
  path('api/updateCalendar', updateCalendar_view),
  re_path('.*', TemplateView.as_view(template_name='index.html')),
]