# feedback/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'feedback/index.html')

def room(request, room_name):
    return render(request, 'feedback/room.html', {
        'room_name': room_name
    })