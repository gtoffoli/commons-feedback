# feedback/producers.py
# https://stackoverflow.com/questions/70159895/django-send-events-via-websocket-to-all-clients
# https://channels.readthedocs.io/en/stable/topics/channel_layers.html#using-outside-of-consumers

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

def feedback_item_producer(group_name, raw_message):
    async_to_sync(channel_layer.group_send)(group_name, {
        "type": "raw_message",
        "text": raw_message
    })

def feedback_dashboard_producer(event_name, dashboard_data):
    async_to_sync(channel_layer.group_send)(event_name, {
        "type": "dashboard_update",
        "data": dashboard_data
    })
