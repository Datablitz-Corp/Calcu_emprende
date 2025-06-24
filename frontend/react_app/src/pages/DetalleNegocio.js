import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

function DetalleNegocio() {
  const { negocioId } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8001/api/detalle-negocio/${negocioId}`)
      .then((res) => {
        setNegocio(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al obtener los datos del negocio.");
      });
  }, [negocioId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!negocio) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>

    
    <div>
      <h2>{negocio.nombre_negocio}</h2>
      <p><strong>Capital propio:</strong> {negocio.capital_propio}</p>
      <p><strong>Monto préstamo:</strong> {negocio.monto_prestamo}</p>
      <p><strong>Interés préstamo:</strong> {negocio.interes_prestamo}</p>
      <p><strong>Costos fijos:</strong> {negocio.costos_fijos}</p>
      <p><strong>Costos variables:</strong> {negocio.costos_variables}</p>
      <p><strong>VAN:</strong> {negocio.VAN}</p>
      <p><strong>TIR:</strong> {negocio.TIR}</p>

      <h3>Productos:</h3>
      <ul>
        {Array.isArray(negocio.productos) ? (
          negocio.productos.map((prod, index) => (
            <li key={index}>
              {prod.nombre_producto_servicio} - Precio: {prod.precio_venta}, 
              Costo: {prod.costo_unitario}, Cantidad: {prod.cantidad_esperada}
            </li>
          ))
        ) : (
          <li>No hay productos registrados.</li>
        )}
      </ul>
    </div>

    </Layout>
  );
}

export default DetalleNegocio;
