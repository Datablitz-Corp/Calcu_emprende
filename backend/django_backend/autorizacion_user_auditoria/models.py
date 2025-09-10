# autorizacion/models.py
from django.db import models
from django.conf import settings

class UserAuditoria(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=50, null=True, blank=True)
    navegador_dispositivo = models.CharField(max_length=255, null=True, blank=True)
    acepta_terminos = models.BooleanField(default=False)
    acepta_politicas = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Auditoría de {self.user.username}"
    
    class Meta:
        db_table = "UserAuditoria"
