from datetime import timedelta
from random import randint

from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.models import User, Group

def create_guests(n, group_name='guest', domain='feedback.edu'):
    """ create guest accounts to be associated to anonymous users """
    group, created = Group.objects.get_or_create(name=group_name)
    for i in range(n):
        first_name = group_name
        last_name =  f"{i+1:03}"
        username = first_name + last_name
        email = "{}@{}".format(username, domain)
        user, created = User.objects.get_or_create(username=username, first_name=first_name, last_name=last_name, email=email)
        if created or not user.groups.all():
            group.user_set.add(user)
        if user.is_active:
            user.is_active = False
            user.save()

def get_guest_account(group_name='guest'):
    guests = User.objects.filter(groups__name=group_name).filter(Q(last_login=None ) | Q(last_login__lte=timezone.now()-timedelta(hours=1)))
    n_guests = guests.count()
    if n_guests:
        i_guest = randint(0, n_guests-1)
        guest = guests[i_guest]
        guest.last_login = timezone.now()
        guest.save()
        return guest
    else:
        return None

def get_fake_account(email, first_name, last_name):
    fake = User(email=email, username=email, first_name=first_name, last_name=last_name, is_active = False)
    fake.last_login = timezone.now()
    fake.save()
    return fake
