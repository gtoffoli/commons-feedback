# feedback/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from commons.utils import unshuffle_integers

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.event_name = self.scope['url_route']['kwargs']['event_name']
        self.chat_group_name = 'chat_%s' % self.event_name

        # Join room group
        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message'].strip()
        user_name = text_data_json.get('user_name', '')
        if user_name: # input from form in dashboard template?
            now = timezone.now()
            message = '{}-{}: {}'.format(str(now.astimezone(settings.TIME_ZONE))[11:19], user_name, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.chat_group_name,
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


class ReactionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_name = self.scope['url_route']['kwargs']['event_name']
        self.reaction_item_producer = 'reaction_%s' % self.event_name

        # Join monitoring group
        await self.channel_layer.group_add(
            self.reaction_item_producer,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave monitoring group
        await self.channel_layer.group_discard(
            self.reaction_item_producer,
            self.channel_name
        )

    # Receive message from websocket for monitoring group
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        verb = message.split()[-1]

        # Send message to monitoring group
        await self.channel_layer.group_send(
            self.reaction_item_producer,
            {
                'type': text_data_json['type'],
                'message': message,
                'verb': verb,
            }
        )

    # Receive raw message from monitoring group
    async def reaction_message(self, event):
        message = event['message']
        verb = message.split()[-1]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'verb': verb,
        }))
