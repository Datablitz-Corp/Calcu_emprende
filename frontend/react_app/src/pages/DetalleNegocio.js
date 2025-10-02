import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { getToken } from "../utils/auth";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
  ResponsiveContainer
} from "recharts";


const colors = {
  primary: "#2A9D8F",
  secondary: "#F87171", // rojo para negativo
  positive: "#2A9D8F",  // verde para positivo
  accent: "#F8F9FA",
  text: "#2F2F2F",
  border: "#DADAD5",
  background: "#FFFFFF"
};

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
        const data = response.data;

        if (data?.productos && typeof data.productos === "string") {
          try { data.productos = JSON.parse(data.productos); } 
          catch { data.productos = []; }
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
        <div className="container mt-4 text-center">Cargando...</div>
      </Layout>
    );
  }

  // Preparar datos del flujo de caja para Recharts
  const flujoData = (negocio.flujo_caja || []).map((item) => ({
    name: `Mes ${item.periodo}`,
    value: item.flujo_neto,
    fill: item.flujo_neto < 0 ? colors.secondary : colors.positive
  }));


  return (
    <Layout>
      <div className="container mt-5">
        {/* Nombre del negocio */}
        <motion.h2
          className="fw-bold mb-5 text-center"
          style={{ color: colors.primary }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {negocio.nombre_negocio}
        </motion.h2>

        {/* VAN y TIR */}
        <div className="row mb-5">
          <motion.div className="col-md-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card shadow-lg h-100" style={{ borderRadius: "15px", border: `1px solid ${colors.border}` }}>
              <div className="card-body text-center">
                <h3 className="fw-bold" style={{ color: colors.primary }}>VAN</h3>
                <h2 className="fw-bold">S/ {negocio.VAN}</h2>
                <p className="text-muted mt-2">
                  {negocio.VAN > 0
                    ? "✅ El VAN es positivo, lo que significa que tu negocio genera más valor del que cuesta. Es rentable."
                    : "⚠️ El VAN es negativo, indicando que tu negocio no recupera la inversión. No es rentable."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-md-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="card shadow-lg h-100" style={{ borderRadius: "15px", border: `1px solid ${colors.border}` }}>
              <div className="card-body text-center">
                <h3 className="fw-bold" style={{ color: colors.primary }}>TIR</h3>
                <h2 className="fw-bold">{negocio.TIR}%</h2>
                <p className="text-muted mt-2">
                  {negocio.TIR > 0
                    ? "✅ La TIR es positiva, significa que tu negocio genera una tasa de retorno atractiva frente al costo de inversión."
                    : "⚠️ La TIR es negativa, el negocio no logra superar el costo de la inversión. La rentabilidad es nula."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Flujo de caja */}
        <div className="mb-4">
          <h4 className="fw-bold mb-3" style={{ color: colors.primary }}>Flujo de caja - 12 meses</h4>
          <div style={{ width: "100%", height: 400 }}>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={flujoData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontWeight: "bold", fontSize: 14 }} />
                <YAxis
                  domain={['dataMin - 400', 'dataMax + 400']}
                  allowDecimals={true}
                  tickFormatter={(value) => value.toFixed(0)}
                />
                <Tooltip formatter={(value) => `S/ ${value.toFixed(0)}`} />
                <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
 

                <Bar dataKey="value" barSize={50} radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    content={(props) => {
                      const { x, y, width, value } = props;

                      // Posición del label dependiendo del signo
                      const posY = value >= 0 ? y - 10 : y + 20;

                      // Color dinámico según signo
                      const labelColor = value >= 0 ? "#2A9D8F" : "#FF6B6B";

                      return (
                        <text
                          x={x + width / 2}
                          y={posY}
                          textAnchor="middle"
                          fill={labelColor}
                          fontWeight="bold"
                        >
                          S/ {value.toFixed(0)}
                        </text>
                      );
                    }}
                  />
                </Bar>


              </BarChart>
            </ResponsiveContainer>


          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-5">
          <motion.a
            href="#"
            className="btn btn-lg fw-bold"
            style={{ backgroundColor: colors.primary, color: "#fff", borderRadius: "12px", padding: "12px 30px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ¿Quieres recibir asesoría financiera? Haz clic aquí
          </motion.a>
        </div>

        {/* Capital, préstamo y costos */}
        <div className="row g-4 mb-5">
          {[
            { label: "Tu capital", value: `S/ ${negocio.capital_propio}` },
            { label: "Tu préstamo", value: `S/ ${negocio.monto_prestamo}` },
            { label: "Interés de tu préstamo", value: `${negocio.interes_prestamo}%` },
            { label: "Tus costos fijos", value: `S/ ${negocio.costos_fijos}` },
            { label: "Tus costos variables", value: `S/ ${negocio.costos_variables}` },
          ].map((item, i) => (
            <motion.div key={i} className="col-md-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="card h-100 shadow-sm" style={{ borderRadius: "12px", border: `1px solid ${colors.border}` }}>
                <div className="card-body text-center">
                  <h6 className="text-muted">{item.label}</h6>
                  <h4 style={{ color: colors.primary }}>{item.value}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Productos o servicios */}
        <motion.div className="mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h4 className="fw-bold mb-3" style={{ color: colors.primary }}>Tus productos o servicios</h4>
          {Array.isArray(negocio.productos) && negocio.productos.length > 0 ? (
            <div className="row g-3">
              {negocio.productos.map((prod, index) => (
                <div key={index} className="col-md-6">
                  <div className="card shadow-sm p-3 h-100" style={{ borderRadius: "12px", border: `1px solid ${colors.border}` }}>
                    <h5 className="fw-bold" style={{ color: colors.secondary }}>{prod.nombre_producto_servicio}</h5>
                    <p>Precio: S/ {prod.precio_venta}</p>
                    <p>Costo: S/ {prod.costo_unitario}</p>
                    <p>Cantidad esperada: {prod.cantidad_esperada}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No tienes productos registrados.</p>
          )}
        </motion.div>

        {/* Tips Financieros */}
        <motion.div className="mb-5 p-4 rounded shadow-sm" style={{ backgroundColor: colors.accent, border: `1px solid ${colors.border}` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h4 className="fw-bold mb-3" style={{ color: colors.primary }}>💡 Tips financieros</h4>
          <ul className="list-unstyled">
            <li className="mb-2">👉 <strong>Valor Actual Neto (VAN):</strong> El VAN refleja cuánto valor extra genera tu negocio en todo el tiempo que dura el proyecto, después de recuperar la inversión inicial.</li>
            <li className="mb-2">👉 <strong>Tasa Interna de Retorno (TIR):</strong> La TIR muestra la tasa de crecimiento promedio que tiene tu inversión cada año.</li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
}

export default DetalleNegocio;
