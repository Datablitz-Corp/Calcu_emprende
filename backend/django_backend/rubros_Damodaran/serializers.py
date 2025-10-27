from rest_framework import serializers
from .models import RubrosDamodaran

class RubrosDamodaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubrosDamodaran
        fields = '__all__'
