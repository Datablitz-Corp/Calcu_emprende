from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Negocio(models.Model):
    ID_negocio = models.BigAutoField(primary_key=True)
    ID_usuario = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="negocio",
        db_column="ID_usuario"
    )
    ID_costo = models.BigIntegerField(null=True, blank=True)
    ID_inversion = models.BigIntegerField(null=True, blank=True)
    Nombre = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
            db_table = 'negocio'

    def __str__(self):
        return self.Nombre or f"Negocio {self.ID_negocio}"
