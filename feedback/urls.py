# feedback/urls.py
from django.urls import path

from feedback import views

urlpatterns = [
    path('dashboard/<str:event_code>/', views.feedback_dashboard, name='feedback_dashboard'),
    path('validate/', views.validate_event, name="validate_event"),
    path('reaction/', views.reaction_message, name="reaction_message"),
    path('chat/', views.chat_message, name="chat_message"),
    path('room_select/', views.room_select, name='room_select'),
    path('<str:room_name>/', views.chat_room, name='chat_room'),
]
