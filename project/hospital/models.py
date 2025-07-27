from django.db import models
from django.utils import timezone

class Patient(models.Model):
    name = models.CharField(max_length=20)
    severity = models.IntegerField()
    admit_time = models.DateTimeField(default=timezone.now)


