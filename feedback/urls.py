# feedback/urls.py
from django.urls import path

from feedback import views

urlpatterns = [
    # path('log/<str:event_code>/', views.feedback_log, name='feedback_log'),
    path('dashboard/<str:event_code>/', views.feedback_dashboard, name='feedback_dashboard'),
    path('process/', views.process_feedback, name="process_feedback"),
    path('validate/', views.validate_event, name="validate_event"),
    path('room_select/', views.room_select, name='room_select'),
    path('<str:room_name>/', views.chat_room, name='chat_room'),
]
