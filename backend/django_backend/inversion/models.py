from django.db import models

class Inversion(models.Model):
    ID_inversion = models.BigAutoField(primary_key=True)
    negocio = models.ForeignKey(
        'negocio.Negocio',
        on_delete=models.SET_NULL,
        null=True,
        db_column='ID_negocio',
        related_name='inversiones'
    )
    capital_propio = models.IntegerField(null=True, blank=True)
    prestamo = models.IntegerField(null=True, blank=True)
    interes = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'inversion'

    def __str__(self):
        return f"Inversión {self.ID_inversion} del Negocio {self.negocio_id}"
