from django.contrib.auth.models import AbstractUser
from django.db import models

#Create your models here.

class User(AbstractUser):
    """
    Custom User model.
    We inherit all fields from Django's AbstractUser.
    Additional fields can be added later.
    """
    pass