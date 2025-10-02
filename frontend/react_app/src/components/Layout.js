import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken, getUser_tok, logout } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';

// Colores
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
};

function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // estado del dropdown

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      const userData = getUser_tok();
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        backgroundColor: colors.background,
        minHeight: '100vh',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fondo blanco */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',  
          zIndex: 0
        }}
      />

      {/* Navbar */}
      <motion.div 
        className="py-3" 
        style={{ 
          backgroundColor: colors.primary,
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container d-flex align-items-center justify-content-between text-white flex-wrap">

          {/* Izquierda: título */}
          <motion.div 
            className="me-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="fw-bold mb-0" style={{ color: colors.lightText }}>EmprendePE</h2>
            {user && (
              <small style={{ color: colors.accent }}>
                Hola, <strong>{user.user}</strong> 👋
              </small>
            )}
          </motion.div>

          {/* Centro: navegación */}
          <motion.ul 
            className="navbar-nav d-flex flex-row gap-4 mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {['dashboard', 'credito', 'asesoria'].map((item) => (
              <motion.li 
                key={item}
                className="nav-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={`/${item}`} 
                  className="nav-link" 
                  style={{ 
                    color: colors.lightText,
                    fontWeight: 500,
                  }}
                >
                  {item === 'dashboard' && 'Negocios'}
                  {item === 'credito' && 'Opciones de Crédito'}
                  {item === 'asesoria' && 'Asesoría'}
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Derecha: perfil */}
          {user && (
            <div className="position-relative">
              <button
                className="btn d-flex align-items-center"
                type="button"
                onClick={() => setOpen(!open)} // toggle dropdown
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <motion.img
                  src="https://i.pravatar.cc/40"
                  alt="perfil"
                  className="rounded-circle me-2"
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    objectFit: "cover",
                    border: `2px solid ${colors.accent}`
                  }}
                  whileHover={{ rotate: 5 }}
                />
                <span style={{ color: colors.lightText }}>{user.nombre}</span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.ul 
                    className="dropdown-menu dropdown-menu-end show"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      position: 'absolute',
                      top: "100%",
                      right: 0,
                      marginTop: "8px"
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => { setOpen(false); navigate("/cuenta"); }}
                        style={{ color: colors.text }}
                      >
                        Cuenta
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => setOpen(false)}
                        style={{ color: colors.text }}
                      >
                        Configuración
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => { setOpen(false); handleLogout(); }}
                        style={{ color: '#E76F51' }}
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contenido */}
      <motion.main 
        className="container mt-4 flex-grow-1" 
        style={{ position: 'relative'}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {children}
      </motion.main>

      {/* Footer */}
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
    </motion.div>
  );
}

export default Layout;
