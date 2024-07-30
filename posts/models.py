from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile
# Create your models here.
class Post(models.Model):
  title = models.CharField(max_length=250)
  body = models.TextField()
  liked = models.ManyToManyField(User, blank=True)
  author = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created = models.DateTimeField(auto_now_add=True)
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return (self.title)
  
  @property
  def like_count(self):
    if self.liked.all().count() > 0:
      return self.liked.all().count()
    else:
      return 0

  class Meta:
    ordering =('-created', '-updated')