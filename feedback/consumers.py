# feedback/consumers.py
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_name = self.scope['url_route']['kwargs']['event_name']
        self.event_group_name = 'feedback_%s' % self.event_name

        # Join monitoring group
        await self.channel_layer.group_add(
            self.event_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave monitoring group
        await self.channel_layer.group_discard(
            self.event_group_name,
            self.channel_name
        )

    # Receive message from websocket for monitoring group
    async def receive(self, feedback_data):
        feedback_data_json = json.loads(feedback_data)

        # Send message to monitoring group
        await self.channel_layer.group_send(
            self.event_group_name,
            {
                'type': feedback_data_json['type'],
                'message': feedback_data_json['text']
            }
        )

    # Receive raw message from monitoring group
    async def raw_message(self, event):
        print('raw_message', event)
        message = event['text']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
