import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { getToken } from "../utils/auth";

function DetalleNegocio() {
  const { negocioId } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = getToken();

        const response = await axios.get(
          `${api}/detalle-negocio/${negocioId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNegocio(response.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los datos del negocio.");
      }
    };

    fetchDetalle();
  }, [negocioId, api]); 
  
  if (error)
    return (
      <Layout>
        <div className="alert alert-danger">{error}</div>
      </Layout>
    );

  if (!negocio)
    return (
      <Layout>
        <div>Cargando...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-3">{negocio.nombre_negocio}</h2>

        <p><strong>Capital propio:</strong> {negocio.capital_propio}</p>
        <p><strong>Monto préstamo:</strong> {negocio.monto_prestamo}</p>
        <p><strong>Interés préstamo:</strong> {negocio.interes_prestamo}</p>
        <p><strong>Costos fijos:</strong> {negocio.costos_fijos}</p>
        <p><strong>Costos variables:</strong> {negocio.costos_variables}</p>
        <p><strong>VAN:</strong> {negocio.VAN}</p>
        <p><strong>TIR:</strong> {negocio.TIR}</p>

        <h4 className="mt-4">Productos / Servicios:</h4>
        {Array.isArray(negocio.productos) && negocio.productos.length > 0 ? (
          <ul className="list-group">
            {negocio.productos.map((prod, index) => (
              <li key={index} className="list-group-item">
                <strong>{prod.nombre_producto_servicio}</strong> — Precio: {prod.precio_venta}, Costo: {prod.costo_unitario}, Cantidad: {prod.cantidad_esperada}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos registrados.</p>
        )}
      </div>
    </Layout>
  );
}

export default DetalleNegocio;
