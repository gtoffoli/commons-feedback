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
from feedback.producers import reaction_item_producer, chat_item_producer


def room_select(request):
    return render(request, 'feedback/room_select.html')

def chat_room(request, room_name):
    return render(request, 'feedback/chat_room.html', {
        'room_name': room_name
    })

def feedback_dashboard(request, event_code):
    event_id, user_id = unshuffle_integers(event_code)
    if event_id and user_id:
        assert request.user.id == user_id
        user = User.objects.get(id=user_id)
        user_name = user.get_display_name()
        event_name = 'event_{}'.format(event_id)
        events = Event.objects.filter(id=event_id)
        if events:
            event = events[0]
            calendar = event.calendar
            relations = CalendarRelation.objects.filter(calendar=calendar)
            project_id = relations[0].object_id
            project = Project.objects.get(id=project_id)
            return render(request, 'feedback/feedback_dashboard.html', {
                'user_name': user_name,
                'event_code': event_code,
                'event_name': event_name,
                'event_title': event.title,
                'project_name': project.name,
                'VUE': True,
            })
    return render(request, 'feedback/feedback_dashboard.html', {
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
                data['event_name'] = 'event_'.format(event_id)
                now = timezone.now()
                if now < event.start or now > event.end:
                    data['warning'] =  _('event is not running')
                return JsonResponse(data)
    data['error'] = error
    return JsonResponse(data)

@csrf_exempt
def reaction_message(request):
    """ Gets and processes real-time user reaction from mobile app and emit xAPI statement.
        user_id: the id of a registered user
        event_id: the id of an Event in a django-schedule Calendar associated to a Project or Community
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        event_code = data['event_code']
        reaction = data['message']
    else:
        event_code = request.GET.get('event_code', '')
        reaction = request.GET.get('message', '')
    event_id, user_id = unshuffle_integers(event_code)
    users = User.objects.filter(id=user_id)
    group_name = ''
    data = {}
    if not users:
        data['error'] = _('user is unknown')
    else:
        user = users[0]
        user_name = user.get_display_name()
        data['user_name'] = user_name
        verb = 'feedback'
        events = Event.objects.filter(id=event_id)
        if not events:
            data['error'] = _('event is unknown')
        else:
            event = events[0]
            event_name = 'event_{}'.format(event_id)
            data['event_name'] = event_name
            group_name = 'reaction_{}'.format(event_name)
            data['group_name'] = group_name
            now = timezone.now()
            if now < event.start or now > event.end:
                data['warning'] = _('event is not running')
            calendar = event.calendar
            relations = CalendarRelation.objects.filter(calendar=calendar)
            project_id = relations[0].object_id
            project = Project.objects.get(id=project_id)
            message = '{}-{}: {}'.format(str(now)[11:19], user_name, reaction)
            if project.is_member(user):
                track_action(request, user, verb, event, target=project)
            else:
                data['warning'] = _('user is not member of community/project')
            # push line to all raw feedback visualizers
            reaction_item_producer(group_name, message)
    return JsonResponse(data)


@csrf_exempt
def chat_message(request):
    """ Gets and processes real-time chat message from mobile app or feedback dashboard
        and emit xAPI statement.
        user_id: the id of a registered user
        event_id: the id of an Event in a django-schedule Calendar associated to a Project or Community
    """
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        event_code = data['event_code']
        message = data['message']
    else:
        event_code = request.GET.get('event_code', '')
        message = request.GET.get('message', '')
    event_id, user_id = unshuffle_integers(event_code)
    users = User.objects.filter(id=user_id)
    group_name = ''
    data = {}
    if not users:
        data['error'] = _('user is unknown')
    else:
        user = users[0]
        user_name = user.get_display_name()
        data['user_name'] = user_name
        verb = 'commented'
        events = Event.objects.filter(id=event_id)
        if not events:
            data['error'] = _('event is unknown')
        else:
            event = events[0]
            event_name = 'event_{}'.format(event_id)
            data['event_name'] = event_name
            group_name = 'chat_{}'.format(event_name)
            data['group_name'] = group_name
            now = timezone.now()
            if now < event.start or now > event.end:
                data['warning'] = _('event is not running')
            calendar = event.calendar
            relations = CalendarRelation.objects.filter(calendar=calendar)
            project_id = relations[0].object_id
            project = Project.objects.get(id=project_id)
            message = '{}-{}: {}'.format(str(now)[11:19], user_name, message)
            if project.is_member(user):
                track_action(request, user, verb, event, target=project)
            else:
                data['warning'] = _('user is not member of community/project')
            # push line to all raw feedback visualizers
            chat_item_producer(group_name, message)
    return JsonResponse(data)

# https://stackoverflow.com/questions/70159895/django-send-events-via-websocket-to-all-clients
# https://stackoverflow.com/questions/54572288/django-channels-group-send-not-working-properly
# https://stackoverflow.com/questions/63693032/django-channels-get-the-current-channel
# https://stackoverflow.com/questions/51083910/integrating-a-data-producer-as-worker-to-django-channels-2-x
# https://channels.readthedocs.io/en/stable/topics/channel_layers.html
