# feedback/producers.py
# https://stackoverflow.com/questions/70159895/django-send-events-via-websocket-to-all-clients
# https://channels.readthedocs.io/en/stable/topics/channel_layers.html#using-outside-of-consumers

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

def reaction_item_producer(group_name, reaction_message):
    async_to_sync(channel_layer.group_send)(group_name, {
        "type": "reaction_message",
        "message": reaction_message
    })

# def feedback_dashboard_producer(event_name, dashboard_data):
def chat_item_producer(group_name, chat_message):
    async_to_sync(channel_layer.group_send)(group_name, {
        "type": "chat_message",
        "message": chat_message
    })
