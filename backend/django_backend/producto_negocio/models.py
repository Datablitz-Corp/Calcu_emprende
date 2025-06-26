from django.db import models
from negocio.models import Negocio
from producto_servicio.models import ProductoServicio

class ProductoNegocio(models.Model):
    ID_producto_negocio = models.BigAutoField(primary_key=True)
    ID_negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    Precv = models.DecimalField(max_digits=12, decimal_places=2)
    Costov = models.DecimalField(max_digits=12, decimal_places=2)
    Cantidad_venta = models.IntegerField()
    ID_producto_servicio = models.ForeignKey(ProductoServicio, on_delete=models.CASCADE)

    class Meta:
            db_table = 'producto_negocio'