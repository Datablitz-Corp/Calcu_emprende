import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Cuenta() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    telefono: ""
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9000/usuario", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setForm(res.data);
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err.response?.data || err.message);
        alert("Error al cargar datos del usuario");
      }
    };

    fetchData();
  }, []);

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:9000/usuario", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Quita el mensaje después de 3 segundos
    } catch (err) {
      console.error("Error al guardar los datos:", err.response?.data || err.message);
      alert("Error al guardar los datos");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Mi Cuenta</h2>

        <div className="mb-3">
          <label>Usuario</label>
          <input
            type="text"
            className="form-control"
            value={form.username}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input
            type="text"
            className="form-control"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Teléfono</label>
          <input
            type="text"
            className="form-control"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {saved && <div className="alert alert-success mt-3">¡Datos guardados correctamente!</div>}
      </div>
    </Layout>
  );
}

export default Cuenta;
