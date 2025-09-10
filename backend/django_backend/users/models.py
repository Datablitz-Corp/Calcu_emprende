from django.contrib.auth.models import AbstractUser
from django.db import models


# Model User
class CustomUser(AbstractUser):
    tipo_documento = models.CharField(max_length=20, null=True, blank=True, default="")
    numero_documento = models.CharField(max_length=30, null=True, blank=True, default="")
    telefono = models.CharField(max_length=15, blank=True, null=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',  
        blank=True
    )

    class Meta:
        db_table = "users_customuser"

