from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from .models import Negocio
from .serializers import NegocioSerializer
import json


# app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection, DatabaseError
import json

class CrearNegocioCompletoView(APIView):
    def post(self, request):
        data = request.data
        try:
            user_id = data.get('id_usuario')
            nombre_negocio = data.get('nombre_negocio')
            capital_propio = data.get('capital_propio')
            prestamo = data.get('prestamo')
            interes = data.get('interes')
            costos = data.get('costos')
            productos = data.get('productos')

            if not user_id or not nombre_negocio:
                return Response({"error": "Faltan datos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

            with connection.cursor() as cursor:
                cursor.execute("SET @p_negocio_id = NULL")
                cursor.execute("""
                    CALL sp_insertar_negocio_completo(%s, %s, %s, %s, %s, %s, %s, @p_negocio_id)
                """, [
                    user_id,
                    nombre_negocio,
                    capital_propio,
                    prestamo,
                    interes,
                    json.dumps(costos),
                    json.dumps(productos),
                ])
                cursor.execute("SELECT @p_negocio_id")
                result = cursor.fetchone()
                negocio_id = result[0] if result else None

            return Response({"message": "Negocio creado con éxito", "negocio_id": negocio_id}, status=status.HTTP_201_CREATED)
        except DatabaseError as e:
            return Response({"error": f"Error en la base de datos: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
