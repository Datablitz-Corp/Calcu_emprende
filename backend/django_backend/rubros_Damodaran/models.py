from django.db import models

class RubrosDamodaran(models.Model):
    id_rubro = models.AutoField(db_column='ID_rubro', primary_key=True)
    nombre_rubro = models.CharField(db_column='Nombre_rubro', max_length=255)
    categoria_base = models.CharField(db_column='Categoria_base', max_length=255)
    beta = models.DecimalField(db_column='Beta', max_digits=4, decimal_places=2)
    beta_apalancado = models.DecimalField(db_column='Beta_apalancado', max_digits=5, decimal_places=3)

    class Meta:
        managed = False  # Ya existe en Aurora
        db_table = 'rubros_Damodaran'

    def __str__(self):
        return self.nombre_rubro
