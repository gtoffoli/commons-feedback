# feedback/routing.py
from django.urls import re_path

from feedback import consumers

websocket_urlpatterns = [
    re_path(r'ws/feedback/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
