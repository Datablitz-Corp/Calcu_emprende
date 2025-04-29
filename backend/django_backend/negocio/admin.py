from django.contrib import admin
from .models import Negocio

@admin.register(Negocio)
class NegocioAdmin(admin.ModelAdmin):
    list_display = ('ID_negocio', 'Nombre', 'ID_usuario', 'ID_costo', 'ID_inversion')
    list_filter = ('ID_usuario',)
    search_fields = ('Nombre',)
