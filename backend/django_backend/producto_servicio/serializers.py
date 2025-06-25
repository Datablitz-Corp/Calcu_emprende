from rest_framework import serializers
from .models import ProductoServicio

class ProductoServicioSerializer(serializers.ModelSerializer):
    nombre_producto_servicio = serializers.CharField(source='nombre_prod_serv')
    precio_venta = serializers.DecimalField(source='Precv', max_digits=12, decimal_places=2)
    costo_unitario = serializers.DecimalField(source='Costov', max_digits=12, decimal_places=2)
    cantidad_esperada = serializers.IntegerField(source='Cantidad_venta')

    class Meta:
        model = ProductoServicio
        fields = [
            'ID_producto_servicio',
            'nombre_producto_servicio',
            'precio_venta',
            'costo_unitario',
            'cantidad_esperada'
        ]
