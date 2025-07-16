from django.db import connection
import numpy_financial as npf

def calcular_var_tir_y_guardar(
    id_negocio,
    capital_propio,
    prestamo,
    interes_anual,
    costos_anuales,
    productos,
    tasa_descuento=10.0
):
    try:
        # Calcular flujo neto mensual
        inversion_inicial = -(capital_propio + prestamo)
        ingreso_anual = sum(p['precio'] * p['cantidad'] for p in productos)
        ingreso_mensual = ingreso_anual / 12
        costos_mensuales = costos_anuales / 12
        pago_interes_mensual = ((interes_anual / 100) * prestamo) / 12
        flujo_neto_mensual = ingreso_mensual - costos_mensuales - pago_interes_mensual

        flujos = []
        for mes in range(1, 13):
            flujo = flujo_neto_mensual
            if mes == 1:
                flujo += inversion_inicial
            flujos.append(flujo)

        # VAN y TIR 
        tasa_mensual = (1 + tasa_descuento / 100) ** (1/12) - 1
        van = npf.npv(tasa_mensual, flujos)
        tir = npf.irr(flujos) * 100

        with connection.cursor() as cursor:
            # Eliminar flujos anteriores
            cursor.callproc("sp_eliminar_flujo_caja", [id_negocio])

            # Insertar flujos nuevos
            for i, flujo in enumerate(flujos, start=1):
                cursor.callproc("sp_insertar_flujo_caja", [id_negocio, i, round(flujo, 2)])

            # Insertar VAN y TIR en tabla Resultados
            cursor.callproc("sp_insertar_resultado", [
                id_negocio,
                round(van, 2),
                round(tir, 2),
                tasa_descuento
            ])

        return round(van, 2), round(tir, 2)

    except Exception as e:
        print("❌ Error al calcular o guardar VAN/TIR:", e)
        return None, None
