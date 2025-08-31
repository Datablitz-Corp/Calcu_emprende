from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este nombre de usuario ya está registrado.")]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este correo electrónico ya está registrado.")]
    )

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'telefono', 'latitud', 'longitud']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_telefono(self, value):
        if not value.isdigit() or len(value) != 9:
            raise serializers.ValidationError("El número de teléfono debe tener exactamente 9 dígitos.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

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

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }