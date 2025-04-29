from rest_framework import serializers
from .models import Negocio

class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        # usamos todos los campos de la tabla
        fields = ['ID_negocio', 'ID_usuario', 'ID_costo', 'ID_inversion', 'Nombre']
        read_only_fields = ['ID_negocio', 'ID_usuario']
