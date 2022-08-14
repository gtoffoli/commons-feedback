# feedback/routing.py
from django.urls import re_path

from feedback import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/event/(?P<event_name>\w+)/$', consumers.EventConsumer.as_asgi()),
]
