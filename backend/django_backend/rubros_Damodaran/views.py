from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .services import listar_rubros, obtener_rubro_por_id

class RubroPorIdView(APIView):
    def get(self, request, id_rubro):
        rubro = obtener_rubro_por_id(id_rubro)
        if rubro:
            return Response(rubro, status=status.HTTP_200_OK)
        return Response({"detail": "Rubro no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class RubrosListarView(APIView):
    def get(self, request):
        try:
            search = request.GET.get('search', '')  # opcional
            order  = request.GET.get('order', '')   # opcional (ej: 'Nombre_rubro' o '-Nombre_rubro')
            data = listar_rubros(search=search, order=order)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)