import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import Layout from "./Layout";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';


export default function Negocio() {
  const [negocios, setNegocios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [negocioEditando, setNegocioEditando] = useState(null);

  const [productos, setProductos] = useState([]);

  const [capitalPropio, setCapitalPropio] = useState("");
  const [montoPrestamo, setMontoPrestamo] = useState("");
  const [interesPrestamo, setInteresPrestamo] = useState("");
  const [costosFijos, setCostosFijos] = useState("");
  const [costosVariables, setCostosVariables] = useState("");

  const agregarProducto = () => {
    setProductos([
      ...productos,
      { nombre: "", precio: "", costo: "", cantidad: "" },
    ]);
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevos = [...productos];
    nuevos[index][campo] = valor;
    setProductos(nuevos);
  };

  const eliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    try {
      const token = getToken();

      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

      //const { data } = await axios.get("http://localhost:9000/negocios/", {
      const { data } = await axios.get(`${api}/negocios/`, {
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

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const idUsuario = decodedToken.user_id; 
    
    // Crear el arreglo de costos por ahora
      const costos = [
        { tipo: "costosFijos", monto: Number(costosFijos) || 0 },
        { tipo: "costosVariables", monto: Number(costosVariables) || 0 },
      ];

      const payload = {
        id_usuario: idUsuario,
        nombre_negocio: nombre,
        capital_propio: parseFloat(capitalPropio) || 0,
        prestamo: parseFloat(montoPrestamo) || 0,
        interes: parseFloat(interesPrestamo) || 0,
        costos: costos, // costos debe ser un array con objetos tipo { tipo, monto }
        productos: productos.map(p => ({
          nombre: p.nombre,
          precv: parseFloat(p.precio) || 0,
          costov: parseFloat(p.costo) || 0,
          cantidad: parseInt(p.cantidad) || 0,
        })),
      };


      console.log("Datos a enviar:", payload); // <-- Aquí muestras los datos que se enviarán


      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";


      if (modoEdicion && negocioEditando) {
        // Editar negocio existente
        await axios.put(
          //`http://localhost:9000/negocios/${negocioEditando.ID_negocio}/`,
          `${api}/negocios/${negocioEditando.ID_negocio}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Negocio con ID ${negocioEditando.ID_negocio} actualizado exitosamente.`);
    
      } else {
        // Crear nuevo negocio


      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

        await axios.post(
          `${api}/negocios/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Nuevo negocio creado exitosamente.");
      }

      cerrarModal();
      fetchNegocios();
    } catch (e) {
      console.error(e);
      alert("Error al guardar negocio");
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

  const abrirModalEditar = (negocio) => {
    setModoEdicion(true);
    setNegocioEditando(negocio);
    setNombre(negocio.Nombre);
    setCapitalPropio(negocio.capital_propio);
    setMontoPrestamo(negocio.monto_prestamo);
    setInteresPrestamo(negocio.interes_anual);
    setCostosFijos(negocio.costos_fijos);
    setCostosVariables(negocio.costos_variables);
    setProductos(negocio.productos || []);
    setError("");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setNegocioEditando(null);
    setNombre("");
    setError("");
    setCapitalPropio("");
    setMontoPrestamo("");
    setInteresPrestamo("");
    setCostosFijos("");
    setCostosVariables("");
    setProductos([]);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="mb-3">
          <h2>Mis Negocios</h2>
        </div>

        <ul className="list-group">
          {Array.isArray(negocios) &&
            negocios.map((n) => (
              <li
                key={n.ID_negocio}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {n.Nombre}
                <div>


                  <button onClick={() => navigate(`/detalle/${negocioId}`)}>Detalle</button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => abrirModalEditar(n)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarNegocio(n.ID_negocio)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {/* Botón flotante */}
        <button
          className="btn btn-primary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1100,
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "8px",
          }}
          onClick={() => {
            setShowModal(true);
            setModoEdicion(false);
            setError("");
            setNombre("");
          }}
        >
          Agregar Negocio
        </button>

        {/* Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          >
            <div
              className="bg-white p-4 rounded"
              style={{
                width: "90%",
                maxWidth: "900px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <h4 className="fw-bold text-center mb-4">
                {modoEdicion ? "Editar Negocio" : "Crear Nuevo Negocio"}
              </h4>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              {/* Nombre del negocio */}
              <div className="mb-4">
                <h6 className="fw-bold">Nombre del Negocio</h6>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Inversión */}
              <div className="mb-4">
                <h6 className="fw-bold">Inversión</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Capital propio</label>
                    <input
                      type="number"
                      className="form-control"
                      value={capitalPropio}
                      onChange={(e) => setCapitalPropio(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Monto préstamo</label>
                    <input
                      type="number"
                      className="form-control"
                      value={montoPrestamo}
                      onChange={(e) => setMontoPrestamo(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Interés del préstamo (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={interesPrestamo}
                      onChange={(e) => setInteresPrestamo(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Costos fijos</label>
                    <input
                      type="number"
                      className="form-control"
                      value={costosFijos}
                      onChange={(e) => setCostosFijos(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Costos variables</label>
                    <input
                      type="number"
                      className="form-control"
                      value={costosVariables}
                      onChange={(e) => setCostosVariables(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="mb-4">
                <h6 className="fw-bold">Productos o Servicios</h6>
                {productos.map((p, index) => (
                  <div key={index} className="border p-3 mb-3 rounded">
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label>Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          value={p.nombre}
                          onChange={(e) =>
                            actualizarProducto(index, "nombre", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label>Precio de venta</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={p.precio}
                          onChange={(e) =>
                            actualizarProducto(index, "precio", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label>Costo unitario</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={p.costo}
                          onChange={(e) =>
                            actualizarProducto(index, "costo", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label>Cantidad esperada</label>
                        <input
                          type="number"
                          className="form-control"
                          value={p.cantidad}
                          onChange={(e) =>
                            actualizarProducto(index, "cantidad", e.target.value)
                          }
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => eliminarProducto(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary w-100"
                  onClick={agregarProducto}
                >
                  Agregar Producto o Servicio
                </button>
              </div>

              {/* Botones de acción */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={crearNegocio}
                >
                  {modoEdicion ? "Guardar cambios" : "Crear Negocio"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
