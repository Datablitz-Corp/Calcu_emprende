import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import Layout from "./Layout";
import axios from "axios";

export default function Negocio() {
  const [negocios, setNegocios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    try {
      const token = getToken();
      const { data } = await axios.get("http://localhost:9000/negocios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNegocios(data);
    } catch (e) {
      console.error(e);
    }
  };

  const crearNegocio = async () => {
    if (nombre.trim() === "") {
      setError("El nombre del negocio es obligatorio.");
      return;
    }
    try {
      const token = getToken();
      await axios.post(
        "http://localhost:9000/negocios/",
        { Nombre: nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre("");
      setError("");
      setShowModal(false);
      fetchNegocios();
    } catch (e) {
      console.error(e);
      alert("Error al crear negocio");
    }
  };

  const eliminarNegocio = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:9000/negocios/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNegocios();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar negocio");
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="mb-3">
          <h2>Mis Negocios</h2>
        </div>

        <ul className="list-group">
          {negocios.map((n) => (
            <li
              key={n.ID_negocio}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {n.Nombre}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarNegocio(n.ID_negocio)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {/* Botón flotante */}
        <button
          className="btn btn-primary floating-create-button rounded-circle"
          onClick={() => {
            setShowModal(true);
            setError("");
          }}
        >
          <span style={{ fontSize: "24px", lineHeight: "0" }}>+</span>
        </button>

        {/* Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <div className="bg-white p-4 rounded" style={{ width: "400px" }}>
              <h5>Crear Nuevo Negocio</h5>

              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <input
                type="text"
                placeholder="Nombre del negocio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control my-3"
              />
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setShowModal(false);
                    setNombre("");
                    setError("");
                  }}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={crearNegocio}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos para botón flotante */}
      <style jsx>{`
        .floating-create-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Layout>
  );
}
