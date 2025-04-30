from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from .models import Negocio
from .serializers import NegocioSerializer

class CrearNegocioView(APIView):
    def post(self, request):
        user_id = request.data.get('ID_usuario')
        nombre = request.data.get('Nombre')

        try:
            with connection.cursor() as cursor:
                cursor.callproc('sp_insertar_negocio', [user_id, nombre])
            return Response({"message": "Negocio creado con éxito"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ListaNegociosUsuarioView(APIView):
    def get(self, request, user_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('sp_ver_negocios_por_usuario', [user_id])
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EliminarNegocioView(APIView):
    def delete(self, request, negocio_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('sp_eliminar_negocio', [negocio_id])
            return Response({"message": "Negocio eliminado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
