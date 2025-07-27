from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("",views.homePage,name='home'),
    path("insert/",views.insert,name="insert"),
    path("delete/",views.delete_patient,name="delete"),
    path("queue/",views.get_queue,name="queue")
]
