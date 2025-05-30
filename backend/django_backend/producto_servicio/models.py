from django.db import models


class ProductoServicio(models.Model):
    ID_producto_servicio = models.BigAutoField(primary_key=True)
    nombre_prod_serv = models.CharField(max_length=150) ## REVISAR
    negocio = models.ForeignKey(
        'negocio.Negocio',
        on_delete=models.SET_NULL,
        null=True,
        db_column='ID_negocio',
        related_name='productos'
    )
    Precv = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    Costov = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    Cantidad_venta = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'producto_servicio'

    def _str_(self):
        return f"Producto {self.ID_producto_servicio} del Negocio {self.negocio_id}"