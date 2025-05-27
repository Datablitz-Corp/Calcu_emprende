from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'telefono', 'latitud', 'longitud']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'password': {'required': True, 'write_only': True},
            'telefono': {'required': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está registrado.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_telefono(self, value):
        if not value.isdigit() or len(value) != 9:
            raise serializers.ValidationError("El número de teléfono debe tener exactamente 9 dígitos.")
        return value
                
    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError({"general": "Ya existe un usuario con estos datos."})


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        raise serializers.ValidationError("Invalid credentials")
