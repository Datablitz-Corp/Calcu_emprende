from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')), 
    path('', include('negocio.urls')),
    path('', include('rubros_Damodaran.urls')),
    ##path("", include("password_reset_token.urls")),
]
