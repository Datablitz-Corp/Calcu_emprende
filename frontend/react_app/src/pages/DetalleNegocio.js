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
        const response = await axios.get(`${api}/detalle-negocio/${negocioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(" Respuesta del backend:", response.data); // ver data
        
        const data = response.data;
        if (data?.productos && typeof data.productos === "string") {
          try {
            data.productos = JSON.parse(data.productos);
          } catch (e) {
            console.warn("Falta productos");
            data.productos = [];
          }
        }

        
        setNegocio(data);


      } catch (err) {
        console.error(err);
        setError("Error al obtener los datos del negocio.");
      }
    };

    fetchDetalle();
  }, [negocioId, api]);

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger mt-4">{error}</div>
      </Layout>
    );
  }

  if (!negocio) {
    return (
      <Layout>
        <div className="container mt-4">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-3">{negocio.nombre_negocio}</h2>

        <div className="mb-3"><strong>Capital propio:</strong> S/ {negocio.capital_propio}</div>
        <div className="mb-3"><strong>Monto préstamo:</strong> S/ {negocio.monto_prestamo}</div>
        <div className="mb-3"><strong>Interés préstamo:</strong> {negocio.interes_prestamo}%</div>
        <div className="mb-3"><strong>Costos fijos:</strong> S/ {negocio.costos_fijos}</div>
        <div className="mb-3"><strong>Costos variables:</strong> S/ {negocio.costos_variables}</div>
        <div className="mb-3"><strong>VAN:</strong> {negocio.VAN !== null ? `S/ ${negocio.VAN}` : "No calculado"}</div>
        <div className="mb-3"><strong>TIR:</strong> {negocio.TIR !== null ? `${negocio.TIR}%` : "No calculado"}</div>


        <h4 className="mt-4">Productos o Servicios:</h4>

        {Array.isArray(negocio.productos) && negocio.productos.length > 0 ? (
          <ul className="list-group">
            {negocio.productos.map((prod, index) => (
              <li key={index} className="list-group-item">
                <strong>{prod.nombre_producto_servicio}</strong><br />
                Precio: S/ {prod.precio_venta}, Costo: S/ {prod.costo_unitario}, Cantidad esperada: {prod.cantidad_esperada}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No hay productos registrados.</p>
        )}
      </div>
    </Layout>
  );
}

export default DetalleNegocio;
