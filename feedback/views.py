# feedback/views.py

import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.models import User
from schedule.models import Event, CalendarRelation
from commons.models import Project
from commons.tracking import track_action

def index(request):
    return render(request, 'feedback/index.html')

def room(request, room_name):
    return render(request, 'feedback/room.html', {
        'room_name': room_name
    })

@csrf_exempt
def get(request):
    """ Gets and processes real-time user feedback from mobile app in xAPI compatible format.
        user_id: the id of a registered user
        event_id: the id of an Event in a django-schedule Calendar associated to a Project or Community
    """
    assert request.method == 'POST'
    data = json.loads(request.body.decode('utf-8'))
    user_id = data['user_id']
    users = User.objects.filter(id=user_id)
    if not users:
        text = 'user is unknown'
    else:
        actor = users[0]
        verb = 'feedback'
        event_id = data['event_id']
        events = Event.objects.filter(id=event_id)
        if not events:
            text = 'event is unknown'
        else:
            event = events[0]
            now = timezone.now()
            if now < event.start or now > event.end:
                text = 'event {} is not running'.format(event.title)
            else:
                calendar = event.calendar
                relations = CalendarRelation.objects.filter(calendar=calendar)
                project_id = relations[0].object_id
                project = Project.objects.get(id=project_id)
                feedback = data['feedback']
                text = 'feedback {} from {} event {} in project {}'.format(feedback, actor.get_display_name(), event.title, project.name)
                if project.is_member(actor):
                    track_action(request, actor, verb, event, target=project)
                else:
                    text += ' '+'but user {} is not member of community/project {}'.format(actor.get_display_name(), project.name)
    print(text)
    data = {'text': text}
    return JsonResponse(data)
