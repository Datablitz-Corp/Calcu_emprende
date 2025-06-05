import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TermsModal from "../components/TermsModal";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    telefono: "",
    latitud: "",
    longitud: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores anteriores
    
    if (!acceptedTerms) {
      setErrors({ general: "Debes aceptar los Términos y Condiciones para continuar." });
      return;
    }
    
    // ✅ Validar el teléfono antes de enviar
    const telefonoRegex = /^\d{9}$/;
    if (!telefonoRegex.test(form.telefono)) {
      setErrors({ telefono: ["El número de teléfono debe tener exactamente 9 dígitos y solo números."] });
      return;
    }
    
    try {
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
  
      //const response = await axios.post("http://localhost:9000/register/", form, {
      const response = await axios.post(`${api}/register/`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("STATUS:", response.status); 
      
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Usuario registrado con éxito.");
        // setTimeout(() => navigate("/login"), 2000); 
        console.log("Respuesta:", response.status);
      }

      
    } catch (err) {
      
      if (err.response && err.response.data) {
        console.error("Errores del backend:", err.response.data);
        
        const backendErrors = err.response.data?.detail?.error || {};
        const formattedErrors = {};
        
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formattedErrors[field] = messages.map(msg => {
              if (typeof msg === "string") return msg;
              if (msg && typeof msg.string === "string") return msg.string;
              return "Error desconocido";
            });
          } else {
            formattedErrors[field] = ["Error desconocido"];
          }
        });
        
        setErrors(formattedErrors);
      } else {
        console.error("Error de conexión o del servidor:", err);
        setErrors({ general: "Error de conexión o del servidor." });
      }
      
      
    }
  };
  
  
  const renderError = (field) => {
    if (errors[field]) {
      return (
        <div className="alert alert-danger mt-1" role="alert" style={{ fontSize: "0.875rem" }}>
        {errors[field][0]}
        </div>
      );
    }
    return null;
  };
  
  return (
    <section
    className="vh-100 bg-image"
    style={{
      backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
    }}
    >
    <div className="mask d-flex align-items-center h-100 gradient-custom-3">
    <div className="container h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
    <div className="col-12 col-md-9 col-lg-7 col-xl-6">
    <div className="card" style={{ borderRadius: "15px" }}>
    <div className="card-body p-5">
    <h2 className="text-uppercase text-center mb-5">
    Crear una cuenta
    </h2>
    
    
    
    <form onSubmit={handleSubmit}>
    
    {/* Mostrar error general */}
    {successMessage && (
      <div className="alert alert-success" role="alert">
      {successMessage}
      </div>
    )}
    
    
    {/* Username */}
    <div className="form-outline mb-4">
    <input
    type="text"
    id="username"
    className="form-control form-control-lg"
    placeholder="Tu nombre de usuario"
    value={form.username}
    onChange={(e) => setForm({ ...form, username: e.target.value })}
    />
    
    
    <label className="form-label" htmlFor="username">
    Nombre de usuario
    </label>
    {renderError('username')}
    </div>
    
    {/* Email */}
    <div className="form-outline mb-4">
    <input
    type="email"
    id="email"
    className="form-control form-control-lg"
    placeholder="Tu correo electrónico"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    />
    
    <label className="form-label" htmlFor="email">
    Correo electrónico
    </label>
    {renderError('email')}
    </div>
    
    {/* Password */}
    <div className="form-outline mb-4">
    <input
    type="password"
    id="password"
    className="form-control form-control-lg"
    placeholder="Contraseña"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    />
    <label className="form-label" htmlFor="password">
    Contraseña
    </label>
    {renderError('password')}
    </div>
    
    {/* Teléfono */}
    <div className="form-outline mb-4">
    <input
    type="text"
    id="telefono"
    className="form-control form-control-lg"
    placeholder="Tu número de teléfono"
    value={form.telefono}
    onChange={(e) => {
      const onlyNums = e.target.value.replace(/\D/g, "");
      setForm({ ...form, telefono: onlyNums });
      
      // Validar en tiempo real
      if (onlyNums.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          telefono: ["El número de teléfono debe tener exactamente 9 dígitos y solo números."]
        }));
      } else {
        // Eliminar error de teléfono si es válido
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.telefono;
          return newErrors;
        });
      }
    }}
    maxLength={9}
    />
    
    
    <label className="form-label" htmlFor="telefono">
    Teléfono
    </label>
    {renderError('telefono')}
    </div>
    
    {/* Latitud */}
    <div className="form-outline mb-4">
    <input
    type="text"
    id="latitud"
    className="form-control form-control-lg"
    placeholder="Tu latitud"
    value={form.latitud}
    onChange={(e) => setForm({ ...form, latitud: e.target.value })}
    />
    <label className="form-label" htmlFor="latitud">
    Latitud
    </label>
    {renderError('latitud')}
    </div>
    
    {/* Longitud */}
    <div className="form-outline mb-4">
    <input
    type="text"
    id="longitud"
    className="form-control form-control-lg"
    placeholder="Tu longitud"
    value={form.longitud}
    onChange={(e) => setForm({ ...form, longitud: e.target.value })}
    />
    <label className="form-label" htmlFor="longitud">
    Longitud
    </label>
    {renderError('longitud')}
    </div>
    
    {/* Checkbox términos */}
    <div className="form-check d-flex justify-content-center mb-5">
    <input
    className="form-check-input me-2"
    type="checkbox"
    id="terms"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    />
    <label className="form-check-label" htmlFor="terms">
    Acepto los{" "}
    <button
    type="button"
    className="btn btn-link text-body p-0"
    data-bs-toggle="modal"
    data-bs-target="#termsModal"
    >
    <u>Términos del servicio</u>
    </button>
    </label>
    </div>
    
    {/* Botón de registro */}
    <div className="d-flex justify-content-center">
    <button
    type="submit"
    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
    >
    Registrarse
    </button>
    </div>
    
    {/* Link a login */}
    <p className="text-center text-muted mt-5 mb-0">
    ¿Ya tienes una cuenta?{" "}
    <button
    type="button"
    className="btn btn-link fw-bold text-body p-0"
    onClick={() => navigate("/login")}
    >
    <u>Inicia sesión aquí</u>
    </button>
    </p>
    </form>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    
    {/* Modal de términos */}
    <TermsModal />
    </section>
  );
}

export default Register;