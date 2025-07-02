import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import { getToken } from "../utils/auth";

export default function EditarNegocio() {
  const { id } = useParams(); // ID del negocio
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [capitalPropio, setCapitalPropio] = useState("");
  const [montoPrestamo, setMontoPrestamo] = useState("");
  const [interesPrestamo, setInteresPrestamo] = useState("");
  const [costosFijos, setCostosFijos] = useState("");
  const [costosVariables, setCostosVariables] = useState("");
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasaDescuento, setTasaDescuento] = useState("");

  const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

  useEffect(() => {
    async function fetchNegocio() {
      try {
        const token = getToken();
        const { data } = await axios.get(`${api}/detalle-negocio/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNombre(data.Nombre || data.nombre_negocio || "");
        setCapitalPropio(data.capital_propio || "");
        setMontoPrestamo(data.prestamo || data.monto_prestamo || "");
        setInteresPrestamo(data.interes || data.interes_prestamo || "");
        setCostosFijos(data.costos_fijos || "");
        setCostosVariables(data.costos_variables || "");

        const rawProductos = typeof data.productos === "string"
          ? JSON.parse(data.productos)
          : data.productos || [];

        const formateados = rawProductos.map((p) => ({
          nombre: p.nombre || p.nombre_producto_servicio || "",
          precio: p.precv || p.precio_venta || 0,
          costo: p.costov || p.costo_unitario || 0,
          cantidad: p.cantidad || p.cantidad_esperada || 0,
        }));

        setProductos(formateados);
        setTasaDescuento(data.tasa_descuento || 10.0);

        
      } catch (err) {
        console.error("Error al cargar negocio:", err);
        setError("No se pudo cargar el negocio.");
      } finally {
        setLoading(false);
      }
    }

    fetchNegocio();
  }, [id]);

  const actualizarProducto = (index, campo, valor) => {
    const copia = [...productos];
    copia[index][campo] = valor;
    setProductos(copia);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", precio: "", costo: "", cantidad: "" }]);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const guardarCambios = async () => {
    try {
      const token = getToken();
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.user_id;

      const payload = {
        id_usuario: userId,
        nombre_negocio: nombre,
        capital_propio: parseFloat(capitalPropio) || 0,
        prestamo: parseFloat(montoPrestamo) || 0,
        interes: parseFloat(interesPrestamo) || 0,
        costos: [
          { tipo: "costosFijos", monto: parseFloat(costosFijos) || 0 },
          { tipo: "costosVariables", monto: parseFloat(costosVariables) || 0 },
        ],
        productos: productos.map((p) => ({
          nombre: p.nombre,
          precv: parseFloat(p.precio) || 0,
          costov: parseFloat(p.costo) || 0,
          cantidad: parseInt(p.cantidad) || 0,
        })),

        tasa_descuento: parseFloat(tasaDescuento) || 10.0, // 
      };

      const response = await axios.put(`${api}/negocio/${id}/actualizar`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Negocio actualizado con éxito.");
        navigate("/dashboard"); // principal
      }
    } catch (e) {
      console.error("Error al actualizar:", e);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger mt-4">{error}</div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mt-4">Cargando datos del negocio...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Editar Negocio</h2>

        <div className="mb-3">
          <label>Nombre del Negocio</label>
          <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Capital propio</label>
            <input type="number" className="form-control" value={capitalPropio} onChange={(e) => setCapitalPropio(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <label>Monto préstamo</label>
            <input type="number" className="form-control" value={montoPrestamo} onChange={(e) => setMontoPrestamo(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <label>Interés (%)</label>
            <input type="number" step="0.01" className="form-control" value={interesPrestamo} onChange={(e) => setInteresPrestamo(e.target.value)} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Costos fijos</label>
            <input type="number" className="form-control" value={costosFijos} onChange={(e) => setCostosFijos(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Costos variables</label>
            <input type="number" className="form-control" value={costosVariables} onChange={(e) => setCostosVariables(e.target.value)} />
          </div>
        </div>
  {/* Inversión 
        <div className="row">
        <div className="col-md-6 mb-3">
            <label>Tasa de descuento (%)</label>
            <input
            type="number"
            className="form-control"
            step="0.01"
            value={tasaDescuento}
            onChange={(e) => setTasaDescuento(e.target.value)}
            />
        </div>
        </div>
*/}
        <h5 className="mt-4">Productos o Servicios</h5>
        {productos.map((p, i) => (
          <div key={i} className="border p-3 mb-3 rounded">
            <div className="row">
              <div className="col-md-6 mb-2">
                <label>Nombre</label>
                <input type="text" className="form-control" value={p.nombre} onChange={(e) => actualizarProducto(i, "nombre", e.target.value)} />
              </div>
              <div className="col-md-6 mb-2">
                <label>Precio</label>
                <input type="number" className="form-control" value={p.precio} onChange={(e) => actualizarProducto(i, "precio", e.target.value)} />
              </div>
              <div className="col-md-6 mb-2">
                <label>Costo</label>
                <input type="number" className="form-control" value={p.costo} onChange={(e) => actualizarProducto(i, "costo", e.target.value)} />
              </div>
              <div className="col-md-6 mb-2">
                <label>Cantidad</label>
                <input type="number" className="form-control" value={p.cantidad} onChange={(e) => actualizarProducto(i, "cantidad", e.target.value)} />
              </div>
              <div className="text-end">
                <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(i)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}

        <button className="btn btn-outline-primary w-100 mb-4" onClick={agregarProducto}>Agregar Producto</button>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={() => navigate("/dasboard")}>Cancelar</button>
          <button className="btn btn-success" onClick={guardarCambios}>Guardar Cambios</button>
        </div>
      </div>
    </Layout>
  );
}
