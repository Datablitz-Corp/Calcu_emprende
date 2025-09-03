import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken, getUser_tok, logout } from "../utils/auth";
import { motion } from "framer-motion";

// Color scheme
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

}

function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    console.log("Access Token:", token); 
    
    if (!token) {
      navigate("/login");
    } else {
      const userData = getUser_tok();
      console.log("Decoded User:", userData); 
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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background pattern/image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://i.ibb.co/6y4W9qN/emprende-pe-pattern.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />

      {/* Barra superior unificada */}
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

          {/* Izquierda: Título y saludo */}
          <motion.div 
            className="me-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="fw-bold mb-0" style={{ color: colors.lightText }}>EmprendePE</h2>
            {user && (
              <small style={{ color: colors.accent }}>
                Hola, <strong>{user.nombre}</strong> 👋
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
            <motion.div 
              className="dropdown"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                className="btn dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
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
              <motion.ul 
                className="dropdown-menu dropdown-menu-end" 
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px'
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.li whileHover={{ scale: 1.02 }}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => navigate("/cuenta")}
                    style={{
                      color: colors.text,
                    }}
                  >
                    Cuenta
                  </button>
                </motion.li>
                <motion.li whileHover={{ scale: 1.02 }}>
                  <button 
                    className="dropdown-item"
                    style={{
                      color: colors.text,
                    }}
                  >
                    Configuración
                  </button>
                </motion.li>
                <li><hr className="dropdown-divider" /></li>
                <motion.li whileHover={{ scale: 1.02 }}>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                    style={{
                      color: '#E76F51',
                    }}
                  >
                    Cerrar sesión
                  </button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Contenido principal */}
      <motion.main 
        className="container mt-4" 
        style={{ position: 'relative'}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {children}
      </motion.main>

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