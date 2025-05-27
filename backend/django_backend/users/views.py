from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import connection

from .serializers import RegisterSerializer, LoginSerializer

class RegisterView(APIView):
    def post(self, request):
        print("Request Data:", request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario creado con éxito"}, status=status.HTTP_201_CREATED)
        
        print("Serializer Errors:", serializer.errors)  
        # Este error sí lo puede entender FastAPI
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
            cursor.callproc('sp_get_user_by_username', [username])
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
            cursor.callproc('sp_update_user_by_username', [
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
