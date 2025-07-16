from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework import status
import traceback
from django.db import connection, DatabaseError
import json
from .funciones import calcular_var_tir_y_guardar


# django_backend/views/eliminar_negocio_view.py



# final - crear negocio con van y tir
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
            tasa_descuento = data.get('tasa_descuento', 10.0)  # Valor por defecto si no se envía

            if not user_id or not nombre_negocio:
                return Response({"error": "Faltan datos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

            with connection.cursor() as cursor:
                cursor.execute("SET @p_negocio_id = NULL")
                cursor.execute("""
                    CALL sp_insertar_negocio_y_generar_resultados(%s, %s, %s, %s, %s, %s, %s, %s, @p_negocio_id)
                """, [
                    user_id,
                    nombre_negocio,
                    capital_propio,
                    prestamo,
                    interes,
                    json.dumps(costos),
                    json.dumps(productos),
                    tasa_descuento
                ])
                cursor.execute("SELECT @p_negocio_id")
                result = cursor.fetchone()
                negocio_id = result[0] if result else None

            return Response({"message": "Negocio creado con éxito", "negocio_id": negocio_id}, status=status.HTTP_201_CREATED)
        except DatabaseError as e:
            return Response({"error": f"Error en la base de datos: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





# crear negocio  (var y tir) backend

class CrearNegocioCompleto_VAN_TIR(APIView):
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
            tasa_descuento = data.get('tasa_descuento', 10.0)

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

            if not negocio_id:
                return Response({"error": "No se pudo crear el negocio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 👇 Calcular VAN y TIR y guardar flujos
            productos_convertidos = [
                {"precio": p.get("precv", 0), "cantidad": p.get("cantidad", 0)}
                for p in productos
            ]
            costos_total = sum(c.get("monto", 0) for c in costos)

            van, tir = calcular_var_tir_y_guardar(
                id_negocio=negocio_id,
                capital_propio=capital_propio,
                prestamo=prestamo,
                interes_anual=interes,
                costos_anuales=costos_total,
                productos=productos_convertidos,
                tasa_descuento=tasa_descuento
            )

            return Response({
                "message": "Negocio creado con éxito",
                "negocio_id": negocio_id,
                "VAN": van,
                "TIR": tir
            }, status=status.HTTP_201_CREATED)

        except DatabaseError as e:
            return Response({"error": f"Error en la base de datos: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# crear negocio solo nombre
class CrearNegocioView(APIView):
    def post(self, request):
        user_id = request.data.get('ID_usuario')
        nombre = request.data.get('Nombre')

        try:
            with connection.cursor() as cursor:
                # sp_insertar_negocio_y_generar_resultados, sp_insertar_negocio
                cursor.callproc('sp_insertar_negocio', [user_id, nombre])
            return Response({"message": "Negocio creado con éxito"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# listar los negocios por usuario en el dashboard
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



## Detalle de 1 negico  
class NegocioDetalleAPIView(APIView):
    def get(self, request, negocio_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc("sp_resumen_negocio_json", [negocio_id])
                result = cursor.fetchone()  # fetchone, no fetchall, ya que esperamos un solo negocio

                if not result:
                    return Response({"detail": "Negocio no encontrado"}, status=404)

                columns = [col[0] for col in cursor.description]
                negocio = dict(zip(columns, result))

                # Procesar campo JSON (productos)
                productos_raw = negocio.get("productos")
                if productos_raw:
                    try:
                        negocio["productos"] = json.loads(productos_raw)
                    except json.JSONDecodeError:
                        negocio["productos"] = []

                return Response(negocio, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# actualizar
class ActualizarNegocioView(APIView):
    def put(self, request, negocio_id):
        try:
            print(" DATA RECIBIDA :", json.dumps(request.data, indent=2))

            nombre = request.data.get("nombre_negocio")
            capital = request.data.get("capital_propio")
            prestamo = request.data.get("prestamo")
            interes = request.data.get("interes")
            costos = request.data.get("costos")
            productos = request.data.get("productos")
            tasa_descuento = request.data.get("tasa_descuento")

            try:
                with connection.cursor() as cursor:
                    cursor.callproc("sp_actualizar_negocio_completo", [
                        negocio_id,
                        nombre,
                        capital,
                        prestamo,
                        interes,
                        json.dumps(costos),
                        json.dumps(productos),
                        tasa_descuento
                    ])
                return Response({"mensaje": "Negocio actualizado con éxito"}, status=status.HTTP_200_OK)
            

            except Exception as e:
                print("❌ Error completo:\n", traceback.format_exc())
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





# Eliminar negocio
class EliminarNegocioView(APIView):
    def delete(self, request, negocio_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('sp_eliminar_negocio_completo', [negocio_id])
                resultado = cursor.fetchall()
            return Response({'mensaje': resultado[0][0]}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
