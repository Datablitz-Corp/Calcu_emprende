from django.urls import path
from .views import EliminarNegocioView,CrearNegocioView, ListaNegociosUsuarioView, EliminarNegocioView, CrearNegocioCompletoView, NegocioDetalleAPIView

urlpatterns = [
    path('negocio/crear/', CrearNegocioView.as_view(), name='crear_negocio'),
    path('negocio/nuevo/', CrearNegocioCompletoView.as_view(), name='nuevo_negocio'),
    path('negocio/lista/<int:user_id>/', ListaNegociosUsuarioView.as_view(), name='listar_negocios'),
    path('eliminar-negocio/<int:negocio_id>/', EliminarNegocioView.as_view(), name='eliminar_negocio'),
    path('detalle-negocio/<int:negocio_id>/', NegocioDetalleAPIView.as_view(), name='detalle-negocio'),
]
