from django.urls import path
from .views import RubrosListarView, RubroPorIdView

urlpatterns = [
    path('listar/', RubrosListarView.as_view(), name='rubros_listar'),
    path('<int:id_rubro>/', RubroPorIdView.as_view(), name='rubro_por_id'),
]
