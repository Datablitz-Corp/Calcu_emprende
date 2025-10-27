import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const colors = {
  primary: "#2A9D8F",
  secondary: "#64C9B7",
  accent: "#F8F9FA",
  text: "#2F2F2F",
  border: "#DADAD5",
  background: "#FFFFFF"
};

function Asesores() {
  const [asesores, setAsesores] = useState([]);

  useEffect(() => {
    // 🔹 Datos estáticos (simulación sin backend)
    const dataDemo = [
      {
        nombre: "María López",
        descripcion: "Especialista en inversión y análisis financiero.",
        foto: "https://randomuser.me/api/portraits/women/65.jpg",
        contacto: "mailto:maria.lopez@empresa.com"
      },
      {
        nombre: "Carlos Fernández",
        descripcion: "Asesor experto en planeación estratégica y negocios.",
        foto: "https://randomuser.me/api/portraits/men/32.jpg",
        contacto: "mailto:carlos.fernandez@empresa.com"
      },
      {
        nombre: "Lucía Ramírez",
        descripcion: "Consultora en desarrollo de startups y PYMES.",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        contacto: "mailto:lucia.ramirez@empresa.com"
      }
    ];

    setTimeout(() => setAsesores(dataDemo), 800); // simulación de carga
  }, []);

  return (
    <Layout>
      <div
        className="container mt-5 mb-5"
        style={{ color: colors.text, backgroundColor: colors.background }}
      >
        <motion.h2
          className="fw-bold text-center mb-5"
          style={{ color: colors.primary }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nuestros Asesores
        </motion.h2>

        {asesores.length === 0 ? (
          <div className="text-center text-muted mt-5">
            Cargando información de asesores...
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center gap-4">
            {asesores.map((asesor, index) => (
              <motion.div
                key={index}
                className="card shadow-lg w-100 p-3"
                style={{
                  maxWidth: "800px",
                  borderRadius: "18px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.accent
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="d-flex flex-column flex-md-row align-items-center">
                  <img
                    src={asesor.foto}
                    alt={asesor.nombre}
                    className="rounded-circle shadow-sm mb-3 mb-md-0"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      marginRight: "25px",
                      border: `3px solid ${colors.primary}`
                    }}
                  />

                  <div className="text-center text-md-start flex-grow-1">
                    <h4 className="fw-bold mb-2" style={{ color: colors.primary }}>
                      {asesor.nombre}
                    </h4>
                    <p className="text-muted mb-3">{asesor.descripcion}</p>
                    <motion.a
                      href={asesor.contacto}
                      className="btn fw-bold px-4"
                      style={{
                        backgroundColor: colors.secondary,
                        color: "white",
                        borderRadius: "25px"
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + Contactar
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Asesores;
