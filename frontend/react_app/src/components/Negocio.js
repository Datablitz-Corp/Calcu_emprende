// Negocios.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Tooltip } from "bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* =========================
   Estilos y animaciones
   ========================= */
const colors = {
  primary: "#2A9D8F",
  secondary: "#64C9B7",
  accent: "#F8F9FA",
  background: "#FFFFFF",
  text: "#2F2F2F",
  accent2: "#FFFFFF",
  lightText: "#FFFFFF",
  border: "#DADAD5",
  error: "#dc3545",
};

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const modalAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

/* =========================
   Categorías mock (para UI)
   ========================= */
const businessCategories = {
  comida: {
    keywords: [
      "comida","alimento","restaurante","café","cafeteria","cafetería","sandwich","hamburguesa","pizza","ceviche","jugo","bebida","panadería","panaderia","pastelería","pasteleria","helado","postre","carrito","food","lunch"
    ],
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🍽️",
  },
  ventas: {
    keywords: [
      "tienda","ropa","boutique","retail","venta","mercado","bazar","electrónica","electronica","zapatos","accesorio","moda","joyería","joyeria","regalo","mueble","decoración","decoracion"
    ],
    images: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🛍️",
  },
  servicios: {
    keywords: [
      "consultoría","consultoria","servicio","asesoría","asesoria","legal","contable","financiero","marketing","diseño","publicidad","evento","fotografía","fotografia","traducción","traduccion"
    ],
    images: [
      "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "💼",
  },
  tecnologia: {
    keywords: ["tecnología","tecnologia","it","software","hardware","computadora","celular","aplicación","aplicacion","app","web","programación","programacion","desarrollo","videojuego","juego"],
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "💻",
  },
  salud: {
    keywords: [
      "salud","médico","medico","farmacia","hospital","clínica","clinica","dentista","odontología","odontologia","psicología","psicologia","masaje","spa","belleza","estética","estetica","peluquería","peluqueria"
    ],
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🏥",
  },
  educacion: {
    keywords: ["educación","educacion","escuela","colegio","universidad","academia","curso","clase","taller","capacitación","capacitacion","idioma","música","musica","arte"],
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🎓",
  },
  transporte: {
    keywords: ["transporte","logística","logistica","camión","camion","moto","taxi","delivery","entrega","envío","envio","mudanza","flete"],
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🚚",
  },
  mascotas: {
    keywords: ["mascota","veterinaria","animal","perro","gato","peluquería","peluqueria","pet","tienda animal","veterinario"],
    images: [
      "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🐶",
  },
  construccion: {
    keywords: [
      "construcción","construccion","obra","arquitectura","diseño","remodelación","remodelacion","electricista","plomería","plomeria","carpintería","carpinteria"
    ],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6a5?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🏗️",
  },
  agricultura: {
    keywords: [
      "agricultura","agrícola","agricola","campo","cultivo","ganadería","ganaderia","vivero","jardín","jardin","flor","planta","orgánico","organico"
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🌱",
  },
  default: {
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    ],
    icon: "🏢",
  },
};

const getRandomImage = (images) => images[Math.floor(Math.random() * images.length)];
const getBusinessData = (name = "") => {
  const lower = name.toLowerCase();
  for (const [cat, data] of Object.entries(businessCategories)) {
    if (cat === "default") continue;
    if (data.keywords.some((k) => lower.includes(k))) {
      return { image: getRandomImage(data.images), icon: data.icon, category: cat };
    }
  }
  return { image: getRandomImage(businessCategories.default.images), icon: businessCategories.default.icon, category: "default" };
};

/* =========================
   Subcomponentes
   ========================= */
function ProductRow({ p, index, onChange, onDelete, colors, tooltip, setTooltip }) {
  return (
    <motion.div
      className="border p-3 mb-3 rounded"
      style={{ backgroundColor: colors.accent }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" style={{ color: colors.text }}>
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            value={p.nombre}
            onChange={(e) => onChange(index, "nombre", e.target.value)}
            placeholder="Nombre del producto"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ color: colors.text }}>
            Precio de venta
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={p.precio}
              onChange={(e) => onChange(index, "precio", e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6" style={{ position: "relative" }}>
          <label className="form-label" style={{ color: colors.text }}>
            Costo unitario{" "}
            <i
              className="bi bi-exclamation-circle ms-1"
              style={{ cursor: "pointer", color: tooltip === `costo-${index}` ? colors.primary : "gray" }}
              onMouseEnter={() => setTooltip(`costo-${index}`)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => setTooltip(tooltip === `click-costo-${index}` ? null : `click-costo-${index}`)}
            ></i>
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={p.costo}
              onChange={(e) => onChange(index, "costo", e.target.value)}
            />
          </div>

          {tooltip === `click-costo-${index}` && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: 10,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px",
                width: "100%",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Es el costo de cada producto. Ej: paquete de 10 gaseosas a S/10 → costo unitario S/1.
            </div>
          )}
        </div>

        <div className="col-md-6" style={{ position: "relative" }}>
          <label className="form-label" style={{ color: colors.text }}>
            Cantidad esperada{" "}
            <i
              className="bi bi-exclamation-circle ms-1"
              style={{ cursor: "pointer", color: tooltip === `cant-${index}` ? colors.primary : "gray" }}
              onMouseEnter={() => setTooltip(`cant-${index}`)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => setTooltip(tooltip === `click-cant-${index}` ? null : `click-cant-${index}`)}
            ></i>
          </label>
          <input
            type="number"
            className="form-control"
            value={p.cantidad}
            onChange={(e) => onChange(index, "cantidad", e.target.value)}
          />

          {tooltip === `click-cant-${index}` && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: 10,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px",
                width: "100%",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Es la cantidad que esperas vender al mes.
            </div>
          )}
        </div>

        <div className="col-12 text-end">
          <motion.button
            className="btn btn-sm"
            style={{ backgroundColor: "#ffebee", color: colors.error, borderColor: colors.error }}
            type="button"
            onClick={() => onDelete(index)}
            whileHover={{ scale: 1.05, backgroundColor: "#ffcdd2" }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-trash me-1"></i> Eliminar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function EvaluacionFields({
  tipoEvaluacion,
  setTipoEvaluacion,
  gananciasMensuales,
  setGananciasMensuales,
  gananciasAnuales,
  setGananciasAnuales,
  crecimientoAnual,
  setCrecimientoAnual,
  colors,
}) {
  const actualizarMensual = (i, v) => {
    const arr = [...gananciasMensuales];
    arr[i] = v;
    setGananciasMensuales(arr);
  };
  const actualizarAnual = (i, v) => {
    const arr = [...gananciasAnuales];
    arr[i] = v;
    setGananciasAnuales(arr);
  };

  return (
    <>
      <div className="mb-4">
        <h6 className="fw-bold mb-3" style={{ color: colors.text }}>
          Tipo de Evaluación
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <motion.button
              type="button"
              className={`btn w-100 py-3 ${tipoEvaluacion === "mensual" ? "border-primary" : ""}`}
              style={{
                backgroundColor: tipoEvaluacion === "mensual" ? colors.primary : colors.accent2,
                color: tipoEvaluacion === "mensual" ? colors.lightText : colors.text,
                border: `2px solid ${tipoEvaluacion === "mensual" ? colors.primary : colors.border}`,
                borderRadius: "8px",
              }}
              onClick={() => setTipoEvaluacion("mensual")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="bi bi-calendar-month me-2"></i>
              Evaluación Mensual
              <br />
              <small>(Recomendada)</small>
            </motion.button>
          </div>
          <div className="col-md-6">
            <motion.button
              type="button"
              className={`btn w-100 py-3 ${tipoEvaluacion === "anual" ? "border-primary" : ""}`}
              style={{
                backgroundColor: tipoEvaluacion === "anual" ? colors.primary : colors.accent2,
                color: tipoEvaluacion === "anual" ? colors.lightText : colors.text,
                border: `2px solid ${tipoEvaluacion === "anual" ? colors.primary : colors.border}`,
                borderRadius: "8px",
              }}
              onClick={() => setTipoEvaluacion("anual")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="bi bi-calendar-year me-2"></i>
              Evaluación Anual
              <br />
              <small>(Simplificada)</small>
            </motion.button>
          </div>
        </div>
      </div>

      {tipoEvaluacion === "mensual" && (
        <div className="mb-4">
          <h6 className="fw-bold mb-3" style={{ color: colors.text }}>
            Evaluación Mensual
          </h6>
          <p className="text-muted mb-3">
            <small>*Los primeros meses podrían ser negativos</small>
          </p>
          <div className="row g-3">
            {gananciasMensuales.map((g, i) => (
              <div key={i} className="col-md-4">
                <label className="form-label" style={{ color: colors.text }}>
                  Mes {i + 1}
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    value={g}
                    onChange={(e) => actualizarMensual(i, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tipoEvaluacion === "anual" && (
        <div className="mb-4">
          <h6 className="fw-bold mb-3" style={{ color: colors.text }}>
            Evaluación Anual
          </h6>
          <p className="text-muted mb-3">
            <small>*Podría ser negativo</small>
          </p>
          <div className="row g-3">
            {gananciasAnuales.map((g, i) => (
              <div key={i} className="col-md-4">
                <label className="form-label" style={{ color: colors.text }}>
                  Año {i + 1}
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    value={g}
                    onChange={(e) => actualizarAnual(i, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tipoEvaluacion && (
        <div className="mb-4">
          <h6 className="fw-bold mb-3" style={{ color: colors.text }}>
            ¿Cuánto esperas crecer anualmente?
          </h6>
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={crecimientoAnual}
                  onChange={(e) => setCrecimientoAnual(e.target.value)}
                  placeholder="0"
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   Componente padre
   ========================= */
export default function Negocios() {
  const navigate = useNavigate();

  // Lista
  const [negocios, setNegocios] = useState([]);

  // Form
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState(null); // ID_rubro (Damodaran)
  const [productos, setProductos] = useState([]);
  const [capitalPropio, setCapitalPropio] = useState("");
  const [montoPrestamo, setMontoPrestamo] = useState("");
  const [interesPrestamo, setInteresPrestamo] = useState("");
  const [costosFijos, setCostosFijos] = useState("");
  const [costosVariables, setCostosVariables] = useState(0);

  // Evaluación
  const [tipoEvaluacion, setTipoEvaluacion] = useState(""); // "mensual" | "anual"
  const [gananciasMensuales, setGananciasMensuales] = useState(Array(12).fill(""));
  const [gananciasAnuales, setGananciasAnuales] = useState(Array(3).fill(""));
  const [crecimientoAnual, setCrecimientoAnual] = useState("");

  // UI/Misc
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [negocioId, setNegocioId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tooltip, setTooltip] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datosPrevios, setDatosPrevios] = useState(null);

  // Rubros
  const [rubros, setRubros] = useState([]);
  const [rubrosLoading, setRubrosLoading] = useState(false);
  const [rubrosError, setRubrosError] = useState("");

  /* ===== Tooltips ===== */
  useEffect(() => {
    const els = document.querySelectorAll("[data-bs-toggle='tooltip']");
    [...els].map((el) => new Tooltip(el));
  }, []);

  /* ===== Cargar negocios ===== */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
        const { data } = await axios.get(`${api}/negocios/`, { headers: { Authorization: `Bearer ${token}` } });
        const withImages = (data || []).map((n) => ({
          ...n,
          ...getBusinessData(n.Nombre || n.nombre_negocio),
        }));
        setNegocios(withImages);
      } catch (e) {
        console.error("Error al obtener negocios:", e);
        setError("No se pudieron cargar los negocios");
      }
    })();
  }, []);

  /* ===== Cargar rubros (Damodaran) ===== */
  useEffect(() => {
    (async () => {
      try {
        setRubrosLoading(true);
        const token = localStorage.getItem("token");
        const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
        const { data } = await axios.get(`${api}/listar`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: "", order: "Nombre_rubro" },
        });
        setRubros(Array.isArray(data) ? data : []);
        setRubrosError("");
      } catch (e) {
        console.error("Error al cargar rubros:", e);
        setRubrosError("No se pudieron cargar los rubros");
      } finally {
        setRubrosLoading(false);
      }
    })();
  }, []);

  /* ===== Helpers rubros ===== */
  const toRubroOption = (r) => {
    if (!r) return null;
    const id = Number(r.ID_rubro);
    const nombre = r.Nombre_rubro ?? "";
    const categoria = r.Categoria_base ?? "";
    const label = [nombre, categoria].filter(Boolean).join(" — ");
    return { id, label };
  };

  /* ===== Productos ===== */
  const agregarProducto = () => setProductos([...productos, { nombre: "", precio: "", costo: "", cantidad: "" }]);
  const actualizarProducto = (i, campo, valor) => {
    const arr = [...productos];
    arr[i][campo] = valor;
    setProductos(arr);
  };
  const eliminarProducto = (i) => setProductos(productos.filter((_, idx) => idx !== i));

  /* ===== Validación ===== */
const validarFormulario = () => {
  if (!nombre.trim()) {
    setError("El nombre del negocio es requerido");
    return false;
  }

  if (nombre.length > 50) {
    setError("El nombre no puede exceder los 50 caracteres");
    return false;
  }

  if (!rubro) {
    setError("Debes seleccionar un rubro (Damodaran)");
    return false;
  }

  if (productos.length === 0) {
    setError("Debe agregar al menos un producto o servicio");
    return false;
  }

  if (!tipoEvaluacion) {
    setError("Debe seleccionar un tipo de evaluación");
    return false;
  }

  if (tipoEvaluacion === "mensual" && gananciasMensuales.some((g) => g === "")) {
    setError("Debe completar todas las ganancias mensuales");
    return false;
  }

  if (tipoEvaluacion === "anual" && gananciasAnuales.some((g) => g === "")) {
    setError("Debe completar todas las ganancias anuales");
    return false;
  }

  if (crecimientoAnual === "") {
    setError("El crecimiento anual esperado es requerido");
    return false;
  }

  // si todo ok
  setError("");
  return true;
};


  /* ===== Crear ===== */
  const crearNegocio = async () => {
    if (!validarFormulario()) return;
    try {
      const token = localStorage.getItem("token");
      const { user_id } = jwtDecode(token);

      const costos = [
        { tipo: "costosFijos", monto: Number(costosFijos) || 0 },
        { tipo: "costosVariables", monto: 0 },
      ];

      const payload = {
        id_usuario: user_id,
        nombre_negocio: nombre,
        rubro: rubro ?? null, // ID_rubro
        capital_propio: parseFloat(capitalPropio) || 0,
        prestamo: parseFloat(montoPrestamo) || 0,
        interes: parseFloat(interesPrestamo) || 0,
        costos,
        productos: productos.map((p) => ({
          nombre: p.nombre,
          precv: parseFloat(p.precio) || 0,
          costov: parseFloat(p.costo) || 0,
          cantidad: parseInt(p.cantidad) || 0,
        })),
        tipo_evaluacion: tipoEvaluacion,
        ganancias_mensuales: tipoEvaluacion === "mensual" ? gananciasMensuales.map((g) => parseFloat(g)) : [],
        ganancias_anuales: tipoEvaluacion === "anual" ? gananciasAnuales.map((g) => parseFloat(g)) : [],
        crecimiento_anual: parseFloat(crecimientoAnual),
        tasa_descuento: 10.0,
      };

      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      await axios.post(`${api}/negocios/`, payload, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess("Negocio creado exitosamente");
      setTimeout(() => {
        cerrarModal();
        setSuccess("");
        recargarNegocios();
      }, 1200);
    } catch (e) {
      console.error("Error al crear negocio:", e);
      setError("Error al crear el negocio. Intente nuevamente.");
    }
  };

  const recargarNegocios = async () => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      const { data } = await axios.get(`${api}/negocios/`, { headers: { Authorization: `Bearer ${token}` } });
      const withImages = (data || []).map((n) => ({
        ...n,
        ...getBusinessData(n.Nombre || n.nombre_negocio),
      }));
      setNegocios(withImages);
    } catch (e) {
      console.error(e);
    }
  };

  /* ===== Actualizar ===== */
  const confirmarActualizacion = () => {
    setMostrarConfirmacion(false);
    actualizarNegocio();
  };

  const actualizarNegocio = async () => {
    if (!validarFormulario()) return;
    try {
      const token = localStorage.getItem("token");
      const { user_id } = jwtDecode(token);

      const costos = [
        { tipo: "costosFijos", monto: parseFloat(costosFijos) || 0 },
        { tipo: "costosVariables", monto: 0 },
      ];

      const payload = {
        id_usuario: user_id,
        nombre_negocio: nombre,
        rubro: rubro ?? null,
        capital_propio: parseFloat(capitalPropio) || 0,
        prestamo: parseFloat(montoPrestamo) || 0,
        interes: parseFloat(interesPrestamo) || 0,
        costos,
        productos: productos.map((p) => ({
          nombre: p.nombre,
          precv: parseFloat(p.precio) || 0,
          costov: parseFloat(p.costo) || 0,
          cantidad: parseInt(p.cantidad) || 0,
        })),
        tipo_evaluacion: tipoEvaluacion,
        ganancias_mensuales: tipoEvaluacion === "mensual" ? gananciasMensuales.map((g) => parseFloat(g)) : [],
        ganancias_anuales: tipoEvaluacion === "anual" ? gananciasAnuales.map((g) => parseFloat(g)) : [],
        crecimiento_anual: parseFloat(crecimientoAnual),
      };

      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

      if (!negocioId) {
        setError("No se encontró el ID del negocio a actualizar");
        return;
      }

      const resp = await axios.put(`${api}/negocio/${negocioId}/actualizar`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.status === 200) {
        setSuccess("Negocio actualizado con éxito");
        setTimeout(() => {
          cerrarModal();
          setSuccess("");
          recargarNegocios();
        }, 1200);
      } else {
        setError("Ocurrió un problema al actualizar el negocio");
      }
    } catch (e) {
      console.error("Error al actualizar:", e);
      setError("Ocurrió un error al intentar actualizar el negocio");
    }
  };

  /* ===== Eliminar ===== */
  const eliminarNegocio = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      await axios.delete(`${api}/eliminar-negocio/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Negocio eliminado correctamente");
      setTimeout(() => {
        setSuccess("");
        recargarNegocios();
      }, 1200);
    } catch (e) {
      console.error(e);
      setError("Error al eliminar negocio");
    }
  };

  /* ===== Abrir modal edición ===== */
  const abrirModalEditar = async (n) => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      const { data: detalle } = await axios.get(`${api}/detalle-negocio/${n.ID_negocio}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModoEdicion(true);
      setNegocioId(n.ID_negocio);

      setNombre(detalle.Nombre || detalle.nombre_negocio || "");
      setCapitalPropio(detalle.capital_propio || "");
      setMontoPrestamo(detalle.prestamo || detalle.monto_prestamo || "");
      setInteresPrestamo(detalle.interes || detalle.interes_prestamo || "");
      setCostosFijos(detalle.costos_fijos || "");
      setCostosVariables(0);

      // rubro ID
      setRubro(detalle.ID_rubro ?? detalle.rubro ?? null);

      // productos
      let productosForm = [];
      try {
        const raw = typeof detalle.productos === "string" ? JSON.parse(detalle.productos) : detalle.productos || [];
        productosForm = raw.map((p) => ({
          nombre: p.nombre || p.nombre_producto_servicio || "",
          precio: p.precv || p.precio_venta || 0,
          costo: p.costov || p.costo_unitario || 0,
          cantidad: p.cantidad || p.cantidad_esperada || 0,
        }));
      } catch (e) {
        console.warn("Error al parsear productos:", e);
      }
      setProductos(productosForm);

      // evaluación
      setTipoEvaluacion(detalle.tipo_evaluacion || "");
      setGananciasMensuales(detalle.ganancias_mensuales || Array(12).fill(""));
      setGananciasAnuales(detalle.ganancias_anuales || Array(3).fill(""));
      setCrecimientoAnual(detalle.crecimiento_anual || "");

      setError("");
      setShowModal(true);
    } catch (e) {
      console.error("Error al obtener detalle del negocio:", e);
      setError("No se pudo cargar el negocio para edición");
    }
  };

  /* ===== Cerrar modal / reset ===== */
  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setNegocioId(null);
    setNombre("");
    setRubro(null);
    setProductos([]);
    setCapitalPropio("");
    setMontoPrestamo("");
    setInteresPrestamo("");
    setCostosFijos("");
    setCostosVariables(0);
    setTipoEvaluacion("");
    setGananciasMensuales(Array(12).fill(""));
    setGananciasAnuales(Array(3).fill(""));
    setCrecimientoAnual("");
    setError("");
  };

  /* =========================
     Render
     ========================= */
  return (
    <Layout>
      <div className="container mt-4" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <motion.h2
            className="fw-bold mb-0"
            style={{ color: colors.primary, fontSize: "2rem", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mis Negocios
          </motion.h2>

          <motion.button
            className="btn py-3 px-4"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(42, 157, 143, 0.3)",
            }}
            onClick={() => {
              setShowModal(true);
              setModoEdicion(false);
              setError("");
              setNombre("");
              setSuccess("");
              setRubro(null);
            }}
            whileHover={{ scale: 1.05, backgroundColor: colors.secondary, boxShadow: "0 6px 8px rgba(42, 157, 143, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Agregar Negocio
          </motion.button>
        </div>

        {success && (
          <motion.div className="alert alert-success" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {success}
          </motion.div>
        )}

        {negocios.length === 0 ? (
          <motion.div className="text-center py-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "200px",
                margin: "0 auto",
                backgroundColor: colors.accent,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
              }}
            >
              {businessCategories.default.icon}
            </div>
            <h4 className="mt-3" style={{ color: colors.text }}>
              No tienes negocios registrados
            </h4>
            <p style={{ color: colors.text }}>Comienza agregando tu primer negocio</p>
          </motion.div>
        ) : (
          <div className="row g-4">
            {negocios.map((n, index) => (
              <motion.div
                key={n.ID_negocio}
                className="col-md-6 col-lg-4"
                variants={cardAnimation}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="card h-100"
                  style={{
                    backgroundColor: colors.accent2,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                  whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(42, 157, 143, 0.15)" }}
                >
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <h4
                      className="card-title mb-3 text-center"
                      style={{
                        color: colors.primary,
                        fontWeight: "600",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {n.Nombre || n.nombre_negocio}
                    </h4>

                    <div
                      className="card-img-top"
                      style={{
                        height: "180px",
                        backgroundColor: colors.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        position: "relative",
                        borderRadius: "8px",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <img
                        src={n.image}
                        alt={n.Nombre || n.nombre_negocio}
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.1))" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.style.fontSize = "5rem";
                          fallback.style.textAlign = "center";
                          fallback.style.width = "100%";
                          fallback.textContent = n.icon;
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <motion.button
                        className="btn w-100 mb-3 py-2"
                        style={{ backgroundColor: colors.primary, color: colors.lightText, border: "none", borderRadius: "8px", fontWeight: "500" }}
                        onClick={() => navigate(`/detalle/${n.ID_negocio}`)}
                        whileHover={{ scale: 1.02, backgroundColor: colors.secondary }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-eye-fill me-2"></i> Ver Detalle
                      </motion.button>

                      <div className="d-flex gap-2">
                        <motion.button
                          className="btn flex-grow-1 py-2"
                          style={{
                            backgroundColor: colors.accent2,
                            color: colors.primary,
                            border: `2px solid ${colors.primary}`,
                            borderRadius: "8px",
                            fontWeight: "500",
                          }}
                          onClick={() => abrirModalEditar(n)}
                          whileHover={{ scale: 1.02, backgroundColor: colors.accent }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="bi bi-pencil-square me-2"></i> Editar
                        </motion.button>
                        <motion.button
                          className="btn py-2 px-3"
                          style={{
                            backgroundColor: colors.accent2,
                            color: colors.error,
                            border: `2px solid ${colors.error}`,
                            borderRadius: "8px",
                            fontWeight: "500",
                          }}
                          onClick={() => {
                            if (window.confirm("¿Estás seguro de que deseas eliminar este negocio?")) {
                              eliminarNegocio(n.ID_negocio);
                            }
                          }}
                          whileHover={{ scale: 1.02, backgroundColor: "#ffebee" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ========== Modal agregar/editar ========== */}
        {showModal && (
          <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <motion.div className="modal-dialog modal-lg modal-dialog-centered" initial="hidden" animate="visible" variants={modalAnimation}>
              <div className="modal-content" style={{ border: "none", borderRadius: "12px" }}>
                <div
                  className="modal-header"
                  style={{ backgroundColor: colors.primary, color: colors.lightText, borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                >
                  <h5 className="modal-title">{modoEdicion ? "Editar Negocio" : "Agregar Nuevo Negocio"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={cerrarModal}></button>
                </div>

                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  {/* Nombre */}
                  <div className="mb-4">
                    <label htmlFor="nombreNegocio" className="form-label fw-bold" style={{ color: colors.text }}>
                      Nombre del Negocio
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombreNegocio"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      style={{ border: `1px solid ${colors.border}`, borderRadius: "8px", padding: "10px" }}
                      placeholder="Ej: Cafetería Central"
                    />
                    <small className="text-muted">Máximo 50 caracteres</small>
                  </div>

                  {/* Rubro Damodaran */}
                  <div className="mb-3">
                    <label className="form-label">Rubro</label>
                    <select
                      className="form-select"
                      value={rubro ?? ""}
                      onChange={(e) => setRubro(e.target.value === "" ? null : Number(e.target.value))}
                      disabled={rubrosLoading}
                    >
                      <option value="">Seleccione un rubro</option>
                      {rubros
                        .map(toRubroOption)
                        .filter(Boolean)
                        .map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                    {rubrosError && <div className="alert alert-warning mt-2 py-2">{rubrosError}</div>}
                  </div>

                  {/* Información financiera */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: colors.text }}>
                      Información Financiera
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center" style={{ color: colors.text }}>
                          Capital propio
                          <i
                            className="bi bi-exclamation-circle ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Tus ahorros: no pagas interés por ello."
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                          ></i>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={capitalPropio}
                            onChange={(e) => setCapitalPropio(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center" style={{ color: colors.text }}>
                          Monto préstamo
                          <i
                            className="bi bi-exclamation-circle ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Dinero prestado por banco o persona, con interés."
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                          ></i>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={montoPrestamo}
                            onChange={(e) => setMontoPrestamo(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center" style={{ color: colors.text }}>
                          Interés del préstamo (%)
                          <i
                            className="bi bi-exclamation-circle ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Ej.: 10% adicional del préstamo."
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                          ></i>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={interesPrestamo}
                            onChange={(e) => setInteresPrestamo(e.target.value)}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center" style={{ color: colors.text }}>
                          Costos fijos mensuales
                          <i
                            className="bi bi-exclamation-circle ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Ej.: alquiler, sueldos, luz, agua, internet."
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                          ></i>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={costosFijos}
                            onChange={(e) => setCostosFijos(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* oculto por ahora */}
                      <input
                        type="hidden"
                        step="0.01"
                        className="form-control"
                        value={costosVariables}
                        onChange={(e) => setCostosVariables(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Productos/Servicios */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0" style={{ color: colors.text }}>
                        Productos/Servicios
                      </h6>
                      <motion.button
                        type="button"
                        className="btn btn-sm"
                        style={{ backgroundColor: colors.primary, color: colors.lightText }}
                        onClick={agregarProducto}
                        whileHover={{ scale: 1.05, backgroundColor: colors.secondary }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Agregar
                      </motion.button>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "gray" }}>
                      Agrega todos tus productos/servicios para una mejor evaluación.
                    </p>

                    {productos.map((p, idx) => (
                      <ProductRow
                        key={idx}
                        p={p}
                        index={idx}
                        onChange={actualizarProducto}
                        onDelete={eliminarProducto}
                        colors={colors}
                        tooltip={tooltip}
                        setTooltip={setTooltip}
                      />
                    ))}
                  </div>

                  {/* Evaluación financiera */}
                  <EvaluacionFields
                    tipoEvaluacion={tipoEvaluacion}
                    setTipoEvaluacion={setTipoEvaluacion}
                    gananciasMensuales={gananciasMensuales}
                    setGananciasMensuales={setGananciasMensuales}
                    gananciasAnuales={gananciasAnuales}
                    setGananciasAnuales={setGananciasAnuales}
                    crecimientoAnual={crecimientoAnual}
                    setCrecimientoAnual={setCrecimientoAnual}
                    colors={colors}
                  />
                </div>

                <div className="modal-footer" style={{ borderTopColor: colors.border }}>
                  <motion.button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: colors.accent2, color: colors.text, border: `1px solid ${colors.border}` }}
                    onClick={cerrarModal}
                    whileHover={{ scale: 1.02, backgroundColor: colors.accent }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: colors.primary, color: colors.lightText, border: "none" }}
                    onClick={modoEdicion ? actualizarNegocio : crearNegocio}
                    whileHover={{ scale: 1.02, backgroundColor: colors.secondary }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {modoEdicion ? (
                      <>
                        <i className="bi bi-check-circle me-1"></i> Guardar Cambios
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-1"></i> Crear Negocio
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Confirmación (si decides usarla) */}
        {mostrarConfirmacion && (
          <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <motion.div className="modal-dialog modal-dialog-centered" initial="hidden" animate="visible" variants={modalAnimation}>
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: colors.primary, color: colors.lightText }}>
                  <h5 className="modal-title">Confirmar Actualización</h5>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro que deseas actualizar este negocio? Esta acción no se puede deshacer.</p>
                  {datosPrevios && (
                    <div className="alert alert-warning">
                      <small>
                        <strong>Datos actuales:</strong>
                        <br />
                        Nombre: {datosPrevios.nombre_negocio}
                        <br />
                        Productos: {datosPrevios.productos?.length || 0}
                      </small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarConfirmacion(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={confirmarActualizacion}>
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}