from django.db import connection

def dictfetchall(cursor):
    cols = [col[0] for col in cursor.description]
    return [dict(zip(cols, row)) for row in cursor.fetchall()]

def listar_rubros(search: str | None = None, order: str | None = None):
    # La SP espera SIEMPRE 2 args. Si no vienen, manda strings vacíos.
    s = (search or "").strip()
    o = (order or "").strip()
    with connection.cursor() as cursor:
        cursor.callproc('sp_rubros_listar', [s, o])
        rows = dictfetchall(cursor)
    return rows

def obtener_rubro_por_id(id_rubro):
    """
    Ejecuta el procedimiento almacenado sp_rubro_por_id
    """
    with connection.cursor() as cursor:
        cursor.callproc('sp_rubro_por_id', [id_rubro])
        resultado = cursor.fetchall()
        columnas = [col[0] for col in cursor.description]
        rubro = [dict(zip(columnas, fila)) for fila in resultado]
    return rubro[0] if rubro else None
