from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

User = get_user_model()



class AuditoriaSerializer(serializers.Serializer):
    ip_address = serializers.CharField(max_length=50, required=False, allow_null=True, allow_blank=True)
    navegador_dispositivo = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    acepta_terminos = serializers.BooleanField()
    acepta_politicas = serializers.BooleanField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    email = serializers.EmailField()
    tipo_documento = serializers.CharField(max_length=20, required=False, allow_null=True, allow_blank=True)
    numero_documento = serializers.CharField(max_length=30, required=False, allow_null=True, allow_blank=True)
    telefono = serializers.CharField(required=False, allow_blank=True)
    latitud = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitud = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)


    auditoria = AuditoriaSerializer(required=False)




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado con este email.")

        if not user.check_password(password):
            raise serializers.ValidationError("Credenciales inválidas.")

        if not user.is_active:
            raise serializers.ValidationError("La cuenta está inactiva.")

        # Crear tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Agregar campos personalizados
        refresh['email'] = user.email
        refresh['user'] = user.username
        access['email'] = user.email
        access['user'] = user.username

        return {
            'refresh': str(refresh),
            'access': str(access),
        }