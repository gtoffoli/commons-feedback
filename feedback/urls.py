# feedback/urls.py
from django.urls import path

from feedback import views

urlpatterns = [
    path('log/<str:event_code>/', views.feedback_log, name='feedback_log'),
    path('process/', views.feedback_process, name="feedback_process"),
    path('room_select/', views.room_select, name='room_select'),
    path('<str:room_name>/', views.chat_room, name='chat_room'),
]
