# feedback/views.py

import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from schedule.models import Event, CalendarRelation
from commons.models import Project
from commons.tracking import track_action
from commons.utils import unshuffle_integers
from feedback.producers import feedback_item_producer, feedback_dashboard_producer


def room_select(request):
    return render(request, 'feedback/room_select.html')

def chat_room(request, room_name):
    return render(request, 'feedback/chat_room.html', {
        'room_name': room_name
    })

def feedback_log(request, event_code):
    event_id, user_id = unshuffle_integers(event_code)
    if event_id and user_id:
        # assert request.user.id == user_id
        event_name = 'event_{}'.format(event_id)
        events = Event.objects.filter(id=event_id)
        if events:
            event = events[0]
            return render(request, 'feedback/feedback_log.html', {
                'event_name': event_name,
                'event_title': event.title
            })
    return render(request, 'feedback/feedback_log.html', {
       'error': _('an invalid event code was specified')                                             
    })

@csrf_exempt
def validate_event(request):
    """ Gets and processes a personal event_code.
        event_code: the code obtained by shuffling user_id and event_id
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        event_code = data['event_code']
        user_email = data['user_email']
    else:
        event_code = request.GET.get('event_code', '')
        user_email = request.GET.get('user_email', '')
    event_id, user_id = unshuffle_integers(event_code)
    data = {}
    data['event_code'] = event_code
    data['user_email'] = user_email
    users = User.objects.filter(id=user_id)
    if not users:
        error = _('user is unknown')
    else:
        user = users[0]
        if not user.is_full_member():
            error = _('user is not authorized')
        elif not user_email==user.email:
            error = _('user email is invalid')
        else:
            data['user'] = user.get_display_name()
            events = Event.objects.filter(id=event_id)
            if not events:
                error = _('event is unknown')
            else:
                event = events[0]
                data['event'] = event.title
                data['start'] = event.start
                data['end'] = event.end
                now = timezone.now()
                if now < event.start or now > event.end:
                    data['warning'] =  _('event is not running')
                return JsonResponse(data)
    data['error'] = error
    return JsonResponse(data)

@csrf_exempt
def process_feedback(request):
    """ Gets and processes real-time user feedback from mobile app in xAPI compatible format.
        user_id: the id of a registered user
        event_id: the id of an Event in a django-schedule Calendar associated to a Project or Community
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        event_code = data['event_code']
        feedback = data['feedback']
    else:
        event_code = request.GET.get('event_code', '')
        feedback = request.GET.get('feedback', 'unknown')
    event_id, user_id = unshuffle_integers(event_code)
    users = User.objects.filter(id=user_id)
    if not users:
        message = _('user is unknown')
    else:
        actor = users[0]
        verb = 'feedback'
        events = Event.objects.filter(id=event_id)
        if not events:
            message = _('event is unknown')
        else:
            event = events[0]
            now = timezone.now()
            if now < event.start or now > event.end:
                message = _('event is not running')
            else:
                calendar = event.calendar
                relations = CalendarRelation.objects.filter(calendar=calendar)
                project_id = relations[0].object_id
                project = Project.objects.get(id=project_id)
                message = 'feedback {} from {} event "{}" in project {}'.format(feedback, actor.get_display_name(), event.title, project.name)
                if project.is_member(actor):
                    track_action(request, actor, verb, event, target=project)
                else:
                    message += ' '+'but user {} is not member of community/project {}'.format(actor.get_display_name(), project.name)
                # push line to all raw feedback visualizers
                event_name = 'event_{}'.format(event_id)
                group_name = 'feedback_{}'.format(event_name)
                feedback_item_producer(group_name, message)
    data = {'text': message, 'group_name': group_name}
    return JsonResponse(data)

# https://stackoverflow.com/questions/70159895/django-send-events-via-websocket-to-all-clients
# https://stackoverflow.com/questions/54572288/django-channels-group-send-not-working-properly
# https://stackoverflow.com/questions/63693032/django-channels-get-the-current-channel
# https://stackoverflow.com/questions/51083910/integrating-a-data-producer-as-worker-to-django-channels-2-x
# https://channels.readthedocs.io/en/stable/topics/channel_layers.html
