from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
  user = models.ForeignKey(User,on_delete=models.CASCADE)
  bio = models.TextField(blank=True,null=True)
  avatar = models.ImageField(upload_to='avatars',default='avatar.png')
  created = models.DateTimeField(auto_now_add=True)
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"profile of the user with {self.user.username}"