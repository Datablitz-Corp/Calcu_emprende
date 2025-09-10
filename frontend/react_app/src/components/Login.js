import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const colors = {
  primary: '#2A9D8F',
  secondary: '#64C9B7',
  accent: '#F4EBC1',
  background: '#FBFBF8',
  text: '#2F2F2F',
  accent2: '#E0F2E9',
  lightText: '#FFFFFF',
  border: '#DADAD5'
};

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
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 4px 6px ${colors.primary}30`,
    zIndex: 10,
    borderBottom: `3px solid ${colors.accent}`
  },
  headerImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15
  },
  headerContent: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 2
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: 0,
    color: colors.lightText,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '0.9rem',
    margin: '0.25rem 0 0 0',
    color: 'rgba(255,255,255,0.8)'
  },
  mainContent: {
    flex: 1,
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 5
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'flex-start'
  },
  infoContainer: {
    position: 'relative'
  },
  infoCard: {
    backgroundColor: colors.lightText,
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: `0 8px 30px ${colors.primary}20`,
    border: `1px solid ${colors.border}`,
    position: 'relative',
    overflow: 'hidden'
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: colors.primary
  },
  introText: {
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  freeText: {
    display: 'block',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: colors.primary,
    margin: '1rem 0',
    backgroundColor: `${colors.accent2}50`,
    padding: '0.5rem',
    borderRadius: '8px'
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: `1px solid ${colors.border}`
  },
  featureIcon: {
    minWidth: '32px',
    height: '32px',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem'
  },
  formContainer: {
    position: 'relative'
  },
  formCard: {
    backgroundColor: colors.lightText,
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: `0 15px 35px ${colors.primary}20`,
    border: `1px solid ${colors.border}`,
    position: 'relative'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: 0,
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: colors.primary
  },
  fieldContainer: {
    marginBottom: '1.5rem',
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
    right: '12px',
    top: '38px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.text,
    fontSize: '1.1rem',
    padding: 0,
    width: '24px',
    height: '24px'
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  checkbox: {
    marginRight: '0.5rem',
    width: '16px',
    height: '16px',
    accentColor: colors.primary
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
    marginBottom: '1.5rem',
    boxShadow: `0 4px 6px ${colors.primary}30`
  },
  socialButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  socialButton: {
    padding: '0.75rem',
    backgroundColor: colors.lightText,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  facebookButton: {
    backgroundColor: '#1877f2',
    color: colors.lightText,
    border: 'none'
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '1.5rem'
  },
  registerText: {
    color: colors.primary,
    fontWeight: 600,
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: `${colors.accent2}50`,
    display: 'inline-block',
    marginLeft: '0.5rem'
  },
  footer: {
    backgroundColor: colors.primary,
    color: colors.lightText,
    padding: '2rem',
    textAlign: 'center',
    borderTop: `3px solid ${colors.accent}`
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  footerLink: {
    color: colors.lightText,
    textDecoration: 'none',
    opacity: 0.8
  },
  errorMessage: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    maxWidth: '90%',
    width: 'auto'
  },
  loaderOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  loader: {
    width: '50px',
    height: '50px',
    border: `5px solid ${colors.primary}`,
    borderTopColor: 'transparent',
    borderRadius: '50%'
  }
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const api = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";
      const response = await axios.post(`${api}/login/`, {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", response.data.access);


      if (rememberMe) {
        // Guardar en localStorage si marcó "Recordarme"
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Guardar en sessionStorage si NO quiere recordar
        sessionStorage.setItem("token", response.data.access);
        sessionStorage.setItem("refresh", response.data.refresh);
      }

      navigate("/dashboard");
      
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión. Intente nuevamente.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.appContainer}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
          borderRadius: "30px",
          transform: "rotate(45deg)",
          zIndex: 0,
          filter: "blur(20px)"
        }}
      />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.7 }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.accent2}15 100%)`,
          borderRadius: "40px",
          transform: "rotate(-15deg)",
          zIndex: 0,
          filter: "blur(25px)"
        }}
      />

      <header style={styles.header}>
        <div style={styles.headerImageOverlay}></div>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>EmprendePe</h1>
          <p style={styles.subtitle}>Menos dudas, más acción</p>
        </div>
      </header>
      
      <main style={styles.mainContent}>
        <div style={styles.gridContainer}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={styles.infoContainer}
          >
            <div style={styles.infoCard}>
              <h2 style={styles.infoTitle}>🧠 ¿Tienes una idea de negocio o ya estás emprendiendo?</h2>
              
              <p style={styles.introText}>
                Cuéntanos sobre tu negocio, lo evaluamos y te ayudamos a saber si va por buen camino.
              </p>
              
              <span style={styles.freeText}>Totalmente gratis!</span>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>¿Qué hacemos por ti?</h3>
              
              <ul style={styles.featuresList}>
                {[
                  { icon: '🔍', text: 'Revisamos tu emprendimiento y su potencial' },
                  { icon: '💸', text: 'Evaluamos la rentabilidad de tu modelo de negocio' },
                  { icon: '🛠️', text: 'Te damos recomendaciones prácticas para mejorar' }
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    style={styles.featureItem}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div style={styles.featureIcon}>{feature.icon}</div>
                    <div>{feature.text}</div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={styles.formContainer}
          >
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Inicia sesión</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={styles.fieldContainer}>
                  <label style={styles.fieldLabel}>Correo electrónico</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={styles.inputField}
                    required
                  />
                </div>
                
                <div style={{ ...styles.fieldContainer, position: 'relative' }}>
                  <label style={styles.fieldLabel}>Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={styles.inputField}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePassword}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                
                <div style={styles.formOptions}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={styles.checkbox}
                    />
                    Recordarme
                  </label>
                  <Link to="/recuperar-contrasena" style={{ ...styles.footerLink, color: colors.primary }}>
                    Olvidé mi contraseña
                  </Link>
                </div>
                
                <motion.button
                  type="submit"
                  style={styles.submitButton}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Iniciar sesión
                </motion.button>
                
                <div style={{ textAlign: 'center', margin: '1.5rem 0', position: 'relative' }}>
                  <span style={{ 
                    padding: '0 1rem', 
                    position: 'relative', 
                    zIndex: 2, 
                    backgroundColor: colors.lightText 
                  }}>
                    o accede con
                  </span>
                </div>
                
                <div style={styles.socialButtons}>
                  <motion.button
                    type="button"
                    style={styles.socialButton}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    style={{ ...styles.socialButton, ...styles.facebookButton }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="white" d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                    </svg>
                    Facebook
                  </motion.button>
                </div>
              </form>
              
              <div style={styles.registerLink}>
                <p>¿No tienes una cuenta? <Link to="/registro" style={styles.registerText}>Regístrate</Link></p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <Link to="/nosotros" style={styles.footerLink}>Nosotros</Link>
          <Link to="/servicios" style={styles.footerLink}>Servicios</Link>
          <Link to="/contacto" style={styles.footerLink}>Contacto</Link>
          <Link to="/terminos" style={styles.footerLink}>Términos</Link>
          <Link to="/privacidad" style={styles.footerLink}>Privacidad</Link>
        </div>
        <p>© {new Date().getFullYear()} EmprendePe. Todos los derechos reservados.</p>
      </footer>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={styles.errorMessage}
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <div style={styles.loaderOverlay}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={styles.loader}
          />
        </div>
      )}
    </div>
  );
}