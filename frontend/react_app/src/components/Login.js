import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../utils/auth";
import { motion } from "framer-motion";

// Paleta de colores actualizada
const colors = {
  primary: '#2A9D8F',     // Verde petróleo – profesional, calmado, confiable
  secondary: '#64C9B7',   // Verde menta – fresco, limpio, suave para fondos o detalles
  accent: '#F4EBC1',      // Beige claro – destaca sin gritar
  background: '#FBFBF8',  // Gris muy claro cálido – evita el blanco puro
  text: '#2F2F2F',        // Gris oscuro – más suave que negro
  accent2: '#E0F2E9',     // Verde muy claro – para zonas suaves o hover
  lightText: '#FFFFFF',
  border: '#DADAD5'       // Gris claro neutro
};

// Estilos actualizados
const styles = {
  appContainer: {
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    background: colors.background,
    color: colors.text,
    position: 'relative'
  },
  header: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: colors.lightText,
    padding: '1.5rem 2rem 0.5rem 2rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 4px 6px ${colors.primary}30`,
    zIndex: 10,
    borderBottom: `3px solid ${colors.accent}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: 0,
    color: colors.lightText
  },
  subtitle: {
    fontSize: '0.95rem',
    fontWeight: 400,
    margin: '0.25rem 0 0 0',
    color: 'rgba(255,255,255,0.9)'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    gap: '3rem',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  infoContainer: {
    maxWidth: '500px',
    color: colors.text
  },
  infoTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '1rem'
  },
  featuresList: {
    fontSize: '1rem',
    lineHeight: '1.6',
    margin: '1rem 0',
    paddingLeft: '1.5rem'
  },
  videoPlaceholder: {
    height: '200px',
    width: '100%',
    marginTop: '2rem',
    border: `2px dashed ${colors.border}`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.border
  },
  formContainer: {
    backgroundColor: colors.lightText,
    padding: '2.5rem',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: `0 8px 30px ${colors.primary}20`,
    border: `1px solid ${colors.border}`,
    position: 'relative'
  },
  formTitle: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 600
  },
  fieldContainer: {
    marginBottom: '1rem',
    position: 'relative'
  },
  fieldLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500
  },
  inputField: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
    backgroundColor: colors.background
  },
  togglePassword: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.text,
    fontSize: '1.1rem'
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  checkbox: {
    marginRight: '0.5rem',
    width: '16px',
    height: '16px',
    accentColor: colors.primary,
    cursor: 'pointer'
  },
  forgotPassword: {
    color: colors.primary,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  submitButton: {
    width: '100%',
    padding: '0.85rem',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: colors.lightText,
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  socialButton: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '8px',
    backgroundColor: colors.lightText,
    border: `1px solid ${colors.border}`,
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    color: colors.lightText,
    border: 'none'
  },
  socialIcon: {
    width: '20px',
    height: '20px'
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: colors.primary,
    color: colors.lightText,
    padding: '1rem',
    textAlign: 'center',
    zIndex: 2,
    position: 'relative',
    overflow: 'hidden'
  },
  footerLink: {
    color: colors.accent,
    textDecoration: 'none',
    margin: '0 0.5rem',
    ':hover': {
      textDecoration: 'underline'
    }
  }
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      const res = await axios.post(`${api}/login/`, form);

      if (res.data && res.data.access) {
        setToken(res.data.access);
        setUser({ nombre: form.username });
        navigate("/dashboard");
      } else {
        alert("No se recibió un token válido. Verifica tus credenciales.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("Credenciales incorrectas o error en el servidor.");
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div style={styles.appContainer}>
      {/* Elementos decorativos de fondo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.accent}20 100%)`,
          borderRadius: "30px",
          transform: "rotate(45deg)",
          zIndex: 0,
          filter: "blur(20px)"
        }}
      />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.7 }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.accent2}15 100%)`,
          borderRadius: "40px",
          transform: "rotate(-15deg)",
          zIndex: 0,
          filter: "blur(25px)"
        }}
      />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.header}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.title}>EmprendePe</h1>
          <p style={styles.subtitle}>Menos dudas, más acción</p>
        </div>
      </motion.header>

      <main style={styles.mainContent}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={styles.infoContainer}
        >
          <h2 style={styles.infoTitle}>Impulsa tu idea de negocio</h2>
          <ul style={styles.featuresList}>
            <li>Te ayudamos con tu negocio totalmente gratis.</li>
            <li>Te aconsejamos sobre su viabilidad y sobre el mercado actual.</li>
            <li>Encuentra opciones de crédito y consejería financiera.</li>
          </ul>
          <div style={styles.videoPlaceholder}>
            Video explicativo próximamente...
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          style={styles.formContainer}
        >
          <h2 style={styles.formTitle}>Inicia sesión</h2>

          <div style={styles.fieldContainer}>
            <label style={styles.fieldLabel}>Usuario</label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={styles.inputField}
                required
              />
            </motion.div>
          </div>

          <div style={{ ...styles.fieldContainer, position: 'relative' }}>
            <label style={styles.fieldLabel}>Contraseña</label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...styles.inputField, paddingRight: '2.5rem' }}
                required
              />
            </motion.div>
            <button
              type="button"
              onClick={togglePassword}
              style={styles.togglePassword}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div style={styles.formOptions}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              /> 
              Recordarme
            </label>
            <a href="#" style={styles.forgotPassword}>
              Olvidé mi contraseña
            </a>
          </div>

          <motion.button
            type="submit"
            style={styles.submitButton}
            whileHover={{ 
              y: -2,
              boxShadow: `0 6px 12px ${colors.primary}40`
            }}
            whileTap={{ scale: 0.98 }}
          >
            Iniciar sesión
          </motion.button>

          <motion.button 
            type="button" 
            style={styles.socialButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
              alt="Google" 
              style={styles.socialIcon}
            />
            Iniciar con Google
          </motion.button>

          <motion.button
            type="button"
            style={{
              ...styles.socialButton,
              ...styles.facebookButton
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
              alt="Facebook" 
              style={styles.socialIcon}
            />
            Iniciar con Facebook
          </motion.button>
        </motion.form>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={styles.footer}
      >
        <p>
          © 2025 EmprendePe. Todos los derechos reservados. | 
          <a href="#" style={styles.footerLink}>Quiénes somos</a> | 
          <a href="mailto:contacto@emprendepe.com" style={styles.footerLink}>contacto@emprendepe.com</a>
        </p>
      </motion.footer>
    </div>
  );
}