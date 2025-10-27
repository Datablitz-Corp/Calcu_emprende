import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Tooltip } from "bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Colores personalizados
const colors = {
  primary: '#2A9D8F',
  secondary: '#64C9B7',
  accent: '#F8F9FA',
  background: '#FFFFFF',
  text: '#2F2F2F',
  accent2: '#FFFFFF',
  lightText: '#FFFFFF',
  border: '#DADAD5',
  error: '#dc3545'
};

// Animaciones
const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const modalAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  }
};

// Categorías de negocios con múltiples imágenes
const businessCategories = {
  comida: {
    keywords: ['comida', 'alimento', 'restaurante', 'café', 'cafeteria', 'cafetería', 'sandwich', 'hamburguesa', 'pizza', 'ceviche', 'jugo', 'bebida', 'panadería', 'panaderia', 'pastelería', 'pasteleria', 'helado', 'postre', 'carrito', 'food', 'lunch'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🍽️'
  },
  ventas: {
    keywords: ['tienda', 'ropa', 'boutique', 'retail', 'venta', 'mercado', 'bazar', 'electrónica', 'electronica', 'zapatos', 'accesorio', 'moda', 'joyería', 'joyeria', 'regalo', 'mueble', 'decoración', 'decoracion'],
    images: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🛍️'
  },
  servicios: {
    keywords: ['consultoría', 'consultoria', 'servicio', 'asesoría', 'asesoria', 'legal', 'contable', 'financiero', 'marketing', 'diseño', 'publicidad', 'evento', 'fotografía', 'fotografia', 'traducción', 'traduccion'],
    images: [
      'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '💼'
  },
  tecnologia: {
    keywords: ['tecnología', 'tecnologia', 'it', 'software', 'hardware', 'computadora', 'celular', 'aplicación', 'aplicacion', 'app', 'web', 'programación', 'programacion', 'desarrollo', 'videojuego', 'juego'],
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '💻'
  },
  salud: {
    keywords: ['salud', 'médico', 'medico', 'farmacia', 'hospital', 'clínica', 'clinica', 'dentista', 'odontología', 'odontologia', 'psicología', 'psicologia', 'masaje', 'spa', 'belleza', 'estética', 'estetica', 'peluquería', 'peluqueria'],
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🏥'
  },
  educacion: {
    keywords: ['educación', 'educacion', 'escuela', 'colegio', 'universidad', 'academia', 'curso', 'clase', 'taller', 'capacitación', 'capacitacion', 'idioma', 'música', 'musica', 'arte'],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🎓'
  },
  transporte: {
    keywords: ['transporte', 'logística', 'logistica', 'camión', 'camion', 'moto', 'taxi', 'delivery', 'entrega', 'envío', 'envio', 'mudanza', 'flete'],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🚚'
  },
  mascotas: {
    keywords: ['mascota', 'veterinaria', 'animal', 'perro', 'gato', 'peluquería', 'peluqueria', 'pet', 'tienda animal', 'veterinario'],
    images: [
      'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🐶'
  },
  construccion: {
    keywords: ['construcción', 'construccion', 'obra', 'arquitectura', 'diseño', 'remodelación', 'remodelacion', 'electricista', 'plomería', 'plomeria', 'carpintería', 'carpinteria'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581093450021-4a7360e9a6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581093450021-4a7360e9a6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🏗️'
  },
  agricultura: {
    keywords: ['agricultura', 'agrícola', 'agricola', 'campo', 'cultivo', 'ganadería', 'ganaderia', 'vivero', 'jardín', 'jardin', 'flor', 'planta', 'orgánico', 'organico'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🌱'
  },
  default: {
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    icon: '🏢'
  }
};

// Función para obtener imagen aleatoria de una categoría
const getRandomImage = (images) => {
  return images[Math.floor(Math.random() * images.length)];
};

// Función para obtener los datos del negocio
const getBusinessData = (businessName) => {
  const lower = (businessName || "").toLowerCase();

  for (const [category, data] of Object.entries(businessCategories)) {
    if (category === 'default') continue;
    
    if (data.keywords.some((k) => lower.includes(k))) {
      return {
        image: getRandomImage(data.images),
        icon: data.icon,
        category
      };
    }
  }

  return {
    image: getRandomImage(businessCategories.default.images),
    icon: businessCategories.default.icon,
    category: 'default'
  };
};

export default function Negocio() {
  const navigate = useNavigate();
  const [negocios, setNegocios] = useState([]);

  // formulario
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState(null); // guarda el ID de rubro
  const [productos, setProductos] = useState([]);
  const [capitalPropio, setCapitalPropio] = useState("");
  const [montoPrestamo, setMontoPrestamo] = useState("");
  const [interesPrestamo, setInteresPrestamo] = useState("");
  const [costosFijos, setCostosFijos] = useState("");
  const [costosVariables, setCostosVariables] = useState(0); // oculto (si más adelante se usa)

  // ui
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [negocioEditando, setNegocioEditando] = useState(null);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datosPrevios, setDatosPrevios] = useState(null);
  const [negocioId, setNegocioId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // rubros (Damodaran)
  const [rubros, setRubros] = useState([]);
  const [rubrosLoading, setRubrosLoading] = useState(false);
  const [rubrosError, setRubrosError] = useState("");

  
  /* ===== tooltips bootstrap ===== */
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map((el) => new Tooltip(el));
  }, []);

  /* ===== cargar negocios ===== */
  useEffect(() => {
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      const { data } = await axios.get(`${api}/negocios/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const negociosConImagenes = (data || []).map((n) => ({
        ...n,
        ...getBusinessData(n.Nombre || n.nombre_negocio),
      }));
      setNegocios(negociosConImagenes);
    } catch (e) {
      console.error("Error al obtener negocios:", e);
      setError("No se pudieron cargar los negocios");
    }
  };

  /* ===== cargar rubros (Damodaran) ===== */
  useEffect(() => {
    const fetchRubros = async () => {
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
    };
    fetchRubros();
  }, []);

  // Debug: ver lo que llega en rubros
  useEffect(() => {
    console.log("Rubros recibidos:", (rubros || []).slice(0, 3));
  }, [rubros]);

  /* ===== util select rubros ===== */
  const toRubroOption = (r) => {
    if (!r) return null;
    const id = Number(r.ID_rubro);
    const nombre = r.Nombre_rubro ?? "";
    const categoria = r.Categoria_base ?? "";
    const label = [nombre, categoria].filter(Boolean).join(" — ");
    return { id, label };
  };

  /* ===== productos ===== */
  const agregarProducto = () => setProductos([...productos, { nombre: "", precio: "", costo: "", cantidad: "" }]);

  const actualizarProducto = (index, campo, valor) => {
    const nuevos = [...productos];
    nuevos[index][campo] = valor;
    setProductos(nuevos);
  };

  const eliminarProducto = (index) => setProductos(productos.filter((_, i) => i !== index));

  /* ===== validación ===== */
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
    return true;
  };

  /* ===== crear negocio ===== */
  const crearNegocio = async () => {
    if (!validarFormulario()) return;
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const idUsuario = decoded.user_id;

      const costos = [
        { tipo: "costosFijos", monto: Number(costosFijos) || 0 },
        { tipo: "costosVariables", monto: 0 },
      ];

      const payload = {
        id_usuario: idUsuario,
        nombre_negocio: nombre,
        rubro: rubro ?? null, // *** ID_rubro
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
        tasa_descuento: 10.0,
      };

      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      await axios.post(`${api}/negocios/`, payload, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess("Negocio creado exitosamente");
      setTimeout(() => {
        cerrarModal();
        setSuccess("");
        fetchNegocios();
      }, 1200);
    } catch (e) {
      console.error("Error al crear negocio:", e);
      setError("Error al crear el negocio. Intente nuevamente.");
    }
  };

  /* ===== actualizar negocio ===== */
  const confirmarActualizacion = () => {
    setMostrarConfirmacion(false);
    actualizarNegocio();
  };
  const cancelarConfirmacion = () => setMostrarConfirmacion(false);

  const actualizarNegocio = async () => {
    if (!validarFormulario()) return;
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const idUsuario = decoded.user_id;

      const costos = [
        { tipo: "costosFijos", monto: parseFloat(costosFijos) || 0 },
        { tipo: "costosVariables", monto: 0 },
      ];

      const payload = {
        id_usuario: idUsuario,
        nombre_negocio: nombre,
        rubro: rubro ?? null, // *** ID_rubro
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
      };

      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

      if (!negocioId) {
        setError("No se encontró el ID del negocio a actualizar");
        return;
      }

      const response = await axios.put(`${api}/negocio/${negocioId}/actualizar`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setSuccess("Negocio actualizado con éxito");
        setTimeout(() => {
          cerrarModal();
          setSuccess("");
          fetchNegocios();
        }, 1200);
      } else {
        setError("Ocurrió un problema al actualizar el negocio");
      }
    } catch (e) {
      console.error("Error al actualizar:", e);
      setError("Ocurrió un error al intentar actualizar el negocio");
    }
  };

  /* ===== eliminar negocio ===== */
  const eliminarNegocio = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      await axios.delete(`${api}/eliminar-negocio/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Negocio eliminado correctamente");
      setTimeout(() => {
        setSuccess("");
        fetchNegocios();
      }, 1200);
    } catch (e) {
      console.error(e);
      setError("Error al eliminar negocio");
    }
  };

  /* ===== abrir modal edición (carga detalle) ===== */
  const abrirModalEditar = async (negocio) => {
    try {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

      const response = await axios.get(`${api}/detalle-negocio/${negocio.ID_negocio}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const detalle = response.data;

      setModoEdicion(true);
      setNegocioId(negocio.ID_negocio);

      setNombre(detalle.Nombre || detalle.nombre_negocio || "");
      setCapitalPropio(detalle.capital_propio || "");
      setMontoPrestamo(detalle.prestamo || detalle.monto_prestamo || "");
      setInteresPrestamo(detalle.interes || detalle.interes_prestamo || "");
      setCostosFijos(detalle.costos_fijos || "");
      setCostosVariables(0);

      // *** rubro desde detalle (ID)
      setRubro(detalle.ID_rubro ?? detalle.rubro ?? null);

      let productosFormateados = [];
      try {
        const raw = typeof detalle.productos === "string" ? JSON.parse(detalle.productos) : detalle.productos || [];
        productosFormateados = raw.map((p) => ({
          nombre: p.nombre || p.nombre_producto_servicio || "",
          precio: p.precv || p.precio_venta || 0,
          costo: p.costov || p.costo_unitario || 0,
          cantidad: p.cantidad || p.cantidad_esperada || 0,
        }));
      } catch (e) {
        console.warn("Error al leer productos:", e);
      }

      setProductos(productosFormateados);
      setError("");
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener detalle del negocio:", error);
      setError("No se pudo cargar el negocio para edición");
    }
  };

  /* ===== cerrar modal ===== */
  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setNegocioEditando(null);
    setRubro(null);
    setNombre("");
    setError("");
    setCapitalPropio("");
    setMontoPrestamo("");
    setInteresPrestamo("");
    setCostosFijos("");
    setCostosVariables(0);
    setProductos([]);
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // FIX comillas
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

                  {/* Rubro (Damodaran) */}
                  <div className="mb-3">
                    <label className="form-label">Rubro (Damodaran)</label>
                    <select
                      className="form-select"
                      value={rubro ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setRubro(v === "" ? null : Number(v));
                      }}
                      disabled={rubrosLoading}
                    >
                      <option key="__none__" value="">
                        Seleccione un rubro
                      </option>
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
                            title="Tus ahorros, es decir tu dinero propio el cual no debes devolverlo ni pagar un interés por él."
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
                            title="El dinero que te prestó el banco u otra persona, la que le debes pagar con un interés."
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
                            title="El porcentaje del interés que deberás pagar. Ejm: 10% adicional del préstamo."
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
                            title="Los costos mensuales de tu negocio. Ejm: alquiler, sueldos, luz, agua, internet."
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

                      {/* Costos variables ocultos (por ahora) */}
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
                      Recuerda agregar todos tus productos o servicios para una mejor evaluación. Ejm: en mi negocio se vende arroz con huevo, coca cola y
                      el combo 1 que se compone de arroz con huevo y coca cola. Por lo tanto, se deben agregar 3 productos.
                    </p>

                    {productos.map((p, index) => (
                      <motion.div
                        key={index}
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
                              onChange={(e) => actualizarProducto(index, "nombre", e.target.value)}
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
                                onChange={(e) => actualizarProducto(index, "precio", e.target.value)}
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
                                onChange={(e) => actualizarProducto(index, "costo", e.target.value)}
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
                                Es el costo de cada uno de tus productos. Ejemplo 1: el paquete de gaseosas está S/10 y vienen 10 gaseosas, entonces el costo
                                unitario es de S/1. Ejemplo 2: para preparar arroz con huevo necesito 30 gr de arroz (S/0.08) y un huevo (S/0.85). El costo
                                unitario sería de S/0.93, la suma de ambos.
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
                              onChange={(e) => actualizarProducto(index, "cantidad", e.target.value)}
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
                                Es la cantidad que esperas vender al mes de tu producto.
                              </div>
                            )}
                          </div>

                          <div className="col-12 text-end">
                            <motion.button
                              className="btn btn-sm"
                              style={{ backgroundColor: "#ffebee", color: colors.error, borderColor: colors.error }}
                              type="button"
                              onClick={() => eliminarProducto(index)}
                              whileHover={{ scale: 1.05, backgroundColor: "#ffcdd2" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <i className="bi bi-trash me-1"></i> Eliminar
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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

        {/* Confirmación (opcional si lo usas) */}
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
                  <button type="button" className="btn btn-secondary" onClick={cancelarConfirmacion}>
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