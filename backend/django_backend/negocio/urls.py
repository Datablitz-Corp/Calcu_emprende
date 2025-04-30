from django.urls import path
from .views import CrearNegocioView, ListaNegociosUsuarioView, EliminarNegocioView

urlpatterns = [
    path('negocio/crear/', CrearNegocioView.as_view(), name='crear_negocio'),
    path('negocio/lista/<int:user_id>/', ListaNegociosUsuarioView.as_view(), name='listar_negocios'),
    path('negocio/eliminar/<int:negocio_id>/', EliminarNegocioView.as_view(), name='eliminar_negocio'),
]
