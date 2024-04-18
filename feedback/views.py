# feedback/views.py

from random import randint
import json
import pytz
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.template.defaultfilters import slugify
from django.utils import timezone, formats
import django.utils.translation
from django.utils.translation import get_language_info, activate, gettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.contrib.contenttypes.models import ContentType
from schedule.models import Calendar, Event, CalendarRelation
from commons.models import Project, get_calendar_events, get_event_project, is_site_member
from commons.analytics import filter_actions
from commons.tracking import track_action
from commons.utils import private_code, unshuffle_integers
from actstream.models import Action

from feedback.producers import reaction_item_producer, chat_item_producer
from feedback.utils import get_guest_account, get_fake_account

import logging
logger = logging.getLogger('tracking')

def get_user_name(user):
    return '{} {}'.format(user.first_name, user.last_name)

def room_select(request):
    return render(request, 'feedback/room_select.html')

def chat_room(request, room_name):
    return render(request, 'feedback/chat_room.html', {
        'room_name': room_name
    })

"""
array = [
  { 'text': "louder", 'label': _("louder"), 'help': _("speack louder"), },
  { 'text': "slower", 'label': _("slower"), 'help': _("speak slower"), },
  { 'text': "pause", 'label': _("pause"), 'help': _("pause a little"), },
  { 'text': "go-on", 'label': _("go on"), 'help': _("restart or proceed"), 'link': "https://google.com" },
  { 'text': "repeat", 'label': _("repeat"), 'help': _("repeat last sentences"), },
  { 'text': "explain", 'label': _("explain"), 'help': _("explain better"), },
  { 'text': "context", 'label': _("context"), 'help': _("provide context information"), },
  { 'text': "example", 'label': _("example"), 'help': _("provide an example"), },
  { 'text': "recap", 'label': _("recap"), 'help': _("recap last topic"), }
]
array = [
  { 'text': "explain", 'label': _("explain"), 'help': _("explain better"), },
  { 'text': "slower", 'label': _("slow down"), 'help': _("slow down"), },
  { 'text': "example", 'label': _("give an example"), 'help': _("give an example"), },
  { 'text': "more", 'label': _("I want to know more"), 'help': _("I want to know more"), },
  { 'text': "comment", 'label': _("I want to comment"), 'help': _("I want to comment"), },
  { 'text': "motivating", 'label': _("motivating"), 'help': _("provide motivation"), },
]
return array
"""

word_array = [
      { 'word': "explain", },
      { 'word': "slower", },
      { 'word': "example", },
      { 'word': "more", },
      { 'word': "comment", },
      { 'word': "motivating", },
]
for item in word_array:
    item['last'] = 0
    item['weight'] = 1

def feedback_dashboard(request, event_code):
    template = 'feedback/feedback_dashboard.html'
    context = {}
    context['user_name'] = ''
    context['event_code'] = ''
    context['next_events'] = []
    # ['word_array'] = json.dumps(word_array())
    context['word_array'] = word_array
    if request.user.is_anonymous:
        context['error'] =  _('not logged in')
        return render(request, template, context)
    assert event_code
    event_id, user_id = unshuffle_integers(event_code)
    if event_id and user_id and request.user.id == user_id:
        # assert request.user.id == user_id
        user = User.objects.get(id=user_id)
        user_name = get_user_name(user)
        events = Event.objects.filter(id=event_id)
        if events:
            event = events[0]
            now = timezone.now()
            not_running = now < event.start or now > event.end
            if (now > event.end) and \
              Action.objects.filter(verb__in=['commented'], action_object_content_type=ContentType.objects.get_for_model(Event), action_object_object_id=event_id).count():
                context['export_url'] = '/feedback/event_export_json/{}/'.format(event_id)
            context.update(event_dict(event, user_id))
            context['user_name'] = user_name
            # context['word_array'] = json.dumps(word_array()) 
            context['not_running'] = not_running
            context['VUE'] = True
            return render(request, template, context)
    else:
        context['error'] = _('an invalid event code was specified')
        return render(request, template, context)

def make_attendee_labels():
    return {
	'label_app_info': _("app info").lower(),
	'label_name': _("name").lower(),
	'label_author': _("authors").lower(),
	'label_funding': _("funding").lower(),
	'label_version': _("version").lower(),
	'label_guide': _("user guide").lower(),
	'label_select_language': _("language selection").lower(),
	'label_view': _("view").lower(),
	'label_event_info': _("event info").lower(),
	'label_error': _("error").lower(),
	'label_user': _("user").lower(),
	'label_unknown_user': _("unknown").lower(),
	'label_project': _("project").lower(),
	'label_event': _("event selection").lower(),
	'label_no_event': _("no event").lower(),
	'label_no_events': _("no events to select").lower(),
	'label_start_date': _("start time").lower(),
	'label_end_date': _("end time").lower(),
	'label_warning': _("warning").lower(),
	'label_no_selected': _("no event selected").lower(),
	'label_not_running': _("event not running").lower(),
	'label_cover': _("home").lower(),
	'label_select': _("event").lower(),
	'label_react': _("react").lower(),
	'label_chat': _("chat").lower(),
	'label_chat_log': _("chat log").lower(),
	'label_language': _("language").lower(),
	'label_about': _("about").lower(),
	'label_guest': _("guest user").lower(),
	'label_exit': _("exit").lower(),
    "label_explain": _("explain").lower(),
    "label_slower": _("slow down").lower(),
    "label_example": _("give an example").lower(),
    "label_more": _("I want to know more").lower(),
    "label_comment": _("I want to comment").lower(),
    "label_motivating": _("motivating").lower(),
	'label_or': _("or").lower(),
	'label_current_language': _("current language").lower(),
	'placeholder_language': _("select the language").lower(),
	'label_get_guest_id': _("get guest identity for the event").capitalize(),
	'button_get_guest_id': _("get guest user id").capitalize(),
	'label_declare_id': _("provide unverified identity data for the event").capitalize(),
	'button_declare_id': _("send data").capitalize(),
	'label_leave_guest_id': _("leave guest identity").capitalize(),
	'button_leave': _("leave").capitalize(),
	'label_event_code': _("event code").lower(),
	'placeholder_generic': _("enter here").lower(),
	'label_email_address': _("email address").lower(),
	'placeholder_email': _("enter email address here").lower(),
	'label_first_name': _("first name").lower(),
	'placeholder_first_name': _("enter first name here").lower(),
	'label_last_name': _("last name").lower(),
	'placeholder_last_name': _("enter last name here").lower(),
	'placeholder_event': _("no event selected yet").lower(),
	'placeholder_chat': _("type a message and hit 'enter' key").lower(),
}

def feedback_attendee(request, event_code=None):
    invalid_request = {'error': _('invalid request')}
    template = 'feedback/feedback_attendee.html'
    context = {}
    supported_languages = ['en', 'es', 'hr', 'it']
    language_options = []
    labels_dict = {}
    current_language_code = request.LANGUAGE_CODE
    context['language_code'] = current_language_code
    for language in settings.LANGUAGES:
        language_code = language[0]
        language_name = language[1]
        if language_code in supported_languages:
            if language_code == current_language_code:
                    context['language_name'] = language_name         
            language_options.append({"language_code": language_code, "language_name": language_name})
            activate(language_code)
            labels_dict[language_code] = make_attendee_labels()
            # print(language_code, labels_dict[language_code])
    activate(current_language_code)
    context['language_options'] = language_options
    context['labels_dict'] = labels_dict
    context['user_name'] = ''
    context['guest_id'] = ''
    context['event_code'] = ''
    # context['word_array'] = json.dumps(word_array())
    context['word_array'] = word_array
    context['error'] = ''
    context['warning'] =  ''
    user = request.user
    context['is_anonymous'] = user.is_anonymous and 1 or 0
    if user.is_anonymous:
        guest_account = request.session.get("guest_account", None)
        if guest_account:
            user_id, event_id = guest_account
            print('feedback_attendee', guest_account, user_id, event_id)
            user = User.objects.get(id=user_id)
            context['guest_id'] = user_id
            context['user_name'] = get_user_name(user)
            context['event_id'] = event_id
            event = Event.objects.get(id=event_id)
            context['event_code'] = private_code(event, user_id)
            context.update(event_dict(event, user_id))
            now = timezone.now()
            context['not_running'] = now < event.start or now > event.end
            return render(request, template, context)
        else:
            context['user_name'] = _('anonymous')
            context['warning'] =  _('anonymous: not logged in')
            return render(request, template, context)
    elif event_code: # obsolete ?                                  
        event_id, user_id = unshuffle_integers(event_code)
        if event_id and user_id and request.user.id == user_id:
            # assert request.user.id == user_id
            events = Event.objects.filter(id=event_id)
            context['user_name'] = get_user_name(user)
        else:
            context['error'] =_('an invalid event code was specified')
        return render(request, template, context)
    else:
        context['user_name'] = get_user_name(user)
        context.update(get_next_events(request, return_context=True))
        return render(request, template, context)

@csrf_exempt
def guest_application(request):
    invalid_request = {'error': _('invalid request')}
    # assert request.method == 'POST'
    if not request.method == 'POST':
        return JsonResponse(invalid_request)
    data = json.loads(request.body.decode('utf-8'))
    event_code = data['event_code']
    event_id, user_id = unshuffle_integers(event_code)
    events = Event.objects.filter(id=event_id)
    users = User.objects.filter(id=user_id)
    if events and users and get_event_project(events[0]).is_member(users[0]):
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        data = {'dummy': 'dummy', 'error': ''}
        if email:
            # assert first_name and last_name
            if not (first_name and last_name):
                return JsonResponse(invalid_request)
            users = User.objects.filter(email=email)
            if users:
                user = users[0]
                if user.is_active:
                    guest = None
                    data['error'] =  _('a registered user already exists with the same email')
                elif user.first_name == first_name and user.last_name == last_name:
                    guest = user
                else:
                    guest = None
                    data['error'] =  _('this email was already used with different first or last name')
            else:
                guest = get_fake_account(email, first_name, last_name)
        else:
            guest = get_guest_account()
            if not guest:
                data['error'] =   _('no guest account currently available')
        if guest:
            request.session['guest_account'] = [guest.id, event_id]
    else:
        data = {}
        data['error'] =  _('an invalid event code was specified')
    return JsonResponse(data)

@csrf_exempt
def guest_exit(request):
    request.session['guest_account'] = None
    return HttpResponseRedirect('/feedback/attendee/')

def event_dict(event, user_id):
    project = get_event_project(event)
    CET = pytz.timezone(settings.TIME_ZONE)
    start_date = formats.date_format(event.start.astimezone(CET), settings.DATETIME_FORMAT)
    now = timezone.now()
    not_running = now < event.start or now > event.end
    context = {
        'event_id': event.id,
        'event_code': private_code(event, user_id),
        'event_name': 'event_{}'.format(event.id),
        'event_title': event.title,
        'start_date': start_date,
        'end_date': formats.date_format(event.end.astimezone(CET), settings.DATETIME_FORMAT),
        'project_name': project.name,
        'name': '{} - {}'.format(event.title, start_date),
        'not_running': not_running
    }
    return context

@csrf_exempt
def get_next_events(request, return_context=False):
    """ Build and return a list of candidate events.
    """
    user = request.user
    data = {}
    calendar = Calendar.objects.get(slug='virtual')
    events = get_calendar_events(request, calendar)
    next_events = [event for event in events if event.end > timezone.now()]
    data['next_events'] = [event_dict(event, user.id) for event in next_events]
    if return_context:
        return data
    else:
        return JsonResponse(data)

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
    error = ''
    if not users:
        error = _('user is unknown')
    else:
        user = users[0]
        if not user.is_full_member():
            error = _('user is not authorized')
        elif not user_email==user.email:
            error = _('user email is invalid')
        else:
            data['user'] = get_user_name(user)
            events = Event.objects.filter(id=event_id)
            if not events:
                error = _('event is unknown')
            else:
                event = events[0]
                data['event'] = event.title
                CET = pytz.timezone(settings.TIME_ZONE)
                data['start'] = formats.date_format(event.start.astimezone(CET), settings.DATETIME_FORMAT)
                data['end'] = formats.date_format(event.end.astimezone(CET), settings.DATETIME_FORMAT)
                data['event_name'] = 'event_{}'.format(event_id)
                now = timezone.now()
                if now < event.start or now > event.end:
                    data['warning'] =  _('event is not running')
                return JsonResponse(data)
    data['error'] = error
    return JsonResponse(data)

time_tolerance = 10 # how many minutes the event may exceed the nominal duration 

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
    else: # this branch is obsolete?
        event_code = request.GET.get('event_code', '')
        reaction = request.GET.get('message', '')
    event_id, user_id = unshuffle_integers(event_code)
    data = {'error': '', 'warning': ''}
    group_name = ''

    user = request.user
    if user.is_anonymous:
        guest_account = request.session.get("guest_account", None)
        if guest_account:
            user_id, event_id = guest_account
            user = User.objects.get(id=user_id)
        else:
            users = User.objects.filter(id=user_id)
            if not users:
                data['error'] = _('user is unknown')
            else:
                user = users[0]

    user_name = get_user_name(user)
    data['user_name'] = user_name
    verb = 'commented'
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
        else:
            project = get_event_project(event)
            CET = pytz.timezone(settings.TIME_ZONE)
            if project.is_member(user):
                format = '{}-{} PM: {}'
            elif is_site_member(user):
                format = '{}-{} SM: {}'
            else:
                format = '{}-{} AN: {}'
            message = format.format(str(now.astimezone(CET))[11:19], user_name, reaction)
            track_action(request, user, verb, event, target=project, response='reaction:'+reaction)
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
    else: # this branch is obsolete?
        event_code = request.GET.get('event_code', '')
        message = request.GET.get('message', '')
    event_id, user_id = unshuffle_integers(event_code)
    group_name = ''
    data = {'error': '', 'warning': ''}

    user = request.user
    if user.is_anonymous:
        guest_account = request.session.get("guest_account", None)
        if guest_account:
            user_id, event_id = guest_account
            user = User.objects.get(id=user_id)
        else:
            users = User.objects.filter(id=user_id)
            if not users:
                data['error'] = _('user is unknown')
            else:
                user = users[0]

    user_name = get_user_name(user)
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
        else:
            project = get_event_project(event)
            CET = pytz.timezone(settings.TIME_ZONE)
            if project.is_member(user):
                format = '{}-{} PM: {}'
            elif is_site_member(user):
                format = '{}-{} SM: {}'
            else:
                format = '{}-{} AN: {}'
            message = format.format(str(now.astimezone(CET))[11:19], user_name, message)
            track_action(request, user, verb, event, target=project, response='chat:'+message)
            # push line to all raw feedback visualizers
            chat_item_producer(group_name, message)
    return JsonResponse(data)

export_template_json = """{
    "id": "%s",
    "timestamp": "%s",
    "actor": {
        "mbox": "mailto:%s",
        "name": "%s",
        "objectType": "Agent"
    },
    "verb": {
        "id": "http://adlnet.gov/expapi/verbs/commented",
        "display": {"en": "commented",}
    },
    "result": {
        "response": "%s"
    },
    "object": {
        "id": "https://www.we-collab.eu/schedule/event/%s/",
        "definition": {
            "name": {"en": "%s"},
            "description": {"en": "%s"},
            "type": "http://activitystrea.ms/schema/1.0/event",
        },
        "objectType": "Activity"
    },
    "context": {
        "platform": "CS we-collab",
        "contextActivities": {
            "grouping": [
                {
                    "id": "%d",
                    "definition": {
                        "name": {"en": "%s"},
                        "type": "http://activitystrea.ms/schema/1.0/group"
                    },
                    "objectType": "Activity"
                }
            ]
        }
    },
},
"""

def event_export_json(request, event_id):
    """ export comments to event (reactions and chat messages)
        as xAPI statements in JSON format """
    event = Event.objects.get(id=event_id)
    event_title = event.title
    event_description = event.description
    project = get_event_project(event)
    project_id = project.id
    project_name = project.name
    # actions = filter_actions(verbs=['commented'], object_content_type=ContentType.objects.get_for_model(Event))
    actions = Action.objects.filter(verb__in=['commented'], action_object_content_type=ContentType.objects.get_for_model(Event), action_object_object_id=event_id)
    print('# actions', actions.count())
    item_list = []
    for action in actions:
        user = action.actor
        actor_name = '{} {}'.format(user.first_name, user.last_name)
        response = action.description
        item = export_template_json % (action.id, action.timestamp, user.email, actor_name, response, event_id, event_title, event_description, project_id, project_name)
        item_list.append(item)
    item_list.reverse()
    json = '[\n' + ',\n'.join(item_list) + '\n]'
    filename = '{}.json'.format(slugify(event_title))
    response = HttpResponse(json, 'application/json')
    response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
    return response
    
# https://stackoverflow.com/questions/70159895/django-send-events-via-websocket-to-all-clients
# https://stackoverflow.com/questions/54572288/django-channels-group-send-not-working-properly
# https://stackoverflow.com/questions/63693032/django-channels-get-the-current-channel
# https://stackoverflow.com/questions/51083910/integrating-a-data-producer-as-worker-to-django-channels-2-x
# https://channels.readthedocs.io/en/stable/topics/channel_layers.html
