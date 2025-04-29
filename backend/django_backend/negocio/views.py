from rest_framework import generics, permissions
from .models import Negocio
from .serializers import NegocioSerializer

class NegocioListCreateView(generics.ListCreateAPIView):
    serializer_class = NegocioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra los negocios por el usuario autenticado
        return Negocio.objects.filter(ID_usuario=self.request.user)

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado al crear
        serializer.save(ID_usuario=self.request.user)

class NegocioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NegocioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ver negocios del propio usuario
        return Negocio.objects.filter(ID_usuario=self.request.user)
