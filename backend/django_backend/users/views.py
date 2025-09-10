from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import connection
from django.db import transaction
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth.hashers import make_password


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            auditoria = data.get("auditoria", {})  # puede venir vacío

            try:
                hashed_password = make_password(data.get("password"))

                with connection.cursor() as cursor:
                    cursor.callproc("sp_register_user", [
                        data.get("username"),
                        hashed_password,
                        data.get("first_name", ""),
                        data.get("last_name", ""),
                        data.get("email"),
                        data.get("tipo_documento", ""),
                        data.get("numero_documento", ""),
                        data.get("latitud", 0),
                        data.get("longitud", 0),
                        data.get("telefono", ""),
                        auditoria.get("ip_address", ""),
                        auditoria.get("navegador_dispositivo", ""),
                        auditoria.get("acepta_terminos", 0),
                        auditoria.get("acepta_politicas", 0),
                        0  # OUT p_user_id
                    ])

                    # Recuperar valor del parámetro OUT
                    cursor.execute("SELECT @_%s_15" % "sp_register_user")
                    user_id = cursor.fetchone()[0]

                return Response({
                    "message": "Usuario registrado correctamente",
                    "user_id": user_id
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        with connection.cursor() as cursor:
            cursor.callproc('sp_get_username', [username])
            result = cursor.fetchall()

        if result:
            user_data = result[0]
            return Response({
                "username": user_data[0],
                "first_name": user_data[1],
                "last_name": user_data[2],
                "email": user_data[3],
                "telefono": user_data[4]
            })
        return Response({"detail": "Usuario no encontrado"}, status=404)

    def put(self, request):
        username = request.user.username
        data = request.data

        with connection.cursor() as cursor:
            cursor.callproc('sp_update_username', [
                username,
                data.get('first_name'),
                data.get('last_name'),
                data.get('email'),
                data.get('telefono')
            ])

        return Response({
            "username": username,
            "first_name": data.get('first_name'),
            "last_name": data.get('last_name'),
            "email": data.get('email'),
            "telefono": data.get('telefono')
        })
