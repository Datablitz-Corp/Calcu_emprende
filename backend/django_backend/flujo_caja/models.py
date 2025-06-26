from django.db import models
from negocio.models import Negocio

class FlujoCaja(models.Model):
    ID_flujo = models.BigAutoField(primary_key=True)
    ID_negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, db_column='ID_negocio')
    Periodo = models.IntegerField()
    Flujo_neto = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
            db_table = 'flujo_caja'