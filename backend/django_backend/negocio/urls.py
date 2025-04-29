from django.urls import path
from .views import NegocioListCreateView, NegocioDetailView

urlpatterns = [
    path('', NegocioListCreateView.as_view(), name='negocio-list-create'),
    path('<int:pk>/', NegocioDetailView.as_view(), name='negocio-detail'),
]
