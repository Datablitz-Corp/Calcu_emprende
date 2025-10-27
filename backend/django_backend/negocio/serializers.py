from rest_framework import serializers
from .models import Negocio
from producto_servicio.serializers import ProductoServicioSerializer  
from rubros_Damodaran.serializers import RubrosDamodaranSerializer

class NegocioSerializer(serializers.ModelSerializer):
    productos = ProductoServicioSerializer(many=True, read_only=True)  
    rubro_detalle = RubrosDamodaranSerializer(source='id_rubro', read_only=True)


    class Meta:
        model = Negocio
        fields = '__all__'
