# feedback/urls.py
from django.urls import path

from feedback import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    path('get', views.get, name="get_feedback"),
]
