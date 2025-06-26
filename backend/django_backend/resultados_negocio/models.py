from django.db import models
from flujo_caja.models import FlujoCaja

class ResultadosNegocio(models.Model):
    ID_resultado = models.BigAutoField(primary_key=True)
    ID_flujo = models.ForeignKey(FlujoCaja, on_delete=models.CASCADE, db_column='ID_flujo')
    VAN = models.DecimalField(max_digits=12, decimal_places=2)
    TIR = models.DecimalField(max_digits=5, decimal_places=2)
    tasa_descuento = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
            db_table = 'resultados_negocio'