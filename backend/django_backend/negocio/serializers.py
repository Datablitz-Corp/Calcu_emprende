# negocio/serializers.py

from rest_framework import serializers
from .models import Negocio
from producto_servicio.serializers import ProductoServicioSerializer  

class NegocioSerializer(serializers.ModelSerializer):
    productos = ProductoServicioSerializer(many=True, read_only=True)  

    class Meta:
        model = Negocio
        fields = '__all__'
