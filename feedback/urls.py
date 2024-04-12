# feedback/urls.py
from django.urls import path

from feedback import views

urlpatterns = [
    path('dashboard/<str:event_code>/', views.feedback_dashboard, name='feedback_dashboard'),
    path('attendee/<str:event_code>/', views.feedback_attendee, name='feedback_attendee_1'),
    path('attendee/', views.feedback_attendee, name='feedback_attendee'),
    path('guest_application/', views.guest_application, name="guest_application"),
    path('guest_exit/', views.guest_exit, name="guest_exit"),
    path('next_events/', views.get_next_events, name='get_next_events'),
    path('validate/', views.validate_event, name="validate_event"),
    path('reaction/', views.reaction_message, name="reaction_message"),
    path('chat/', views.chat_message, name="chat_message"),
    path('event_export_json/<int:event_id>/', views.event_export_json, name="event_export_json"),
    path('room_select/', views.room_select, name='room_select'),
    path('<str:room_name>/', views.chat_room, name='chat_room'),
]
