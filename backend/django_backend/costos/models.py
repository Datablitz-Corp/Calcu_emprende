from django.db import models

class Costos(models.Model):
    ID_costo = models.BigAutoField(primary_key=True)
    negocio = models.ForeignKey(
        'negocio.Negocio',
        on_delete=models.SET_NULL,
        null=True,
        db_column='ID_negocio',
        related_name='costos'
    )
    Tipo_costo = models.CharField(max_length=100, null=True, blank=True)
    Monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'costos'

    def __str__(self):
        return f"{self.Tipo_costo} - {self.Monto}"
