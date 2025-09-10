import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TermsModal from '../components/TermsModal';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    latitud: '',
    longitud: ''
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Obtener geolocalización
  useEffect(() => {
    if (navigator.geolocation) {
      const confirmed = window.confirm(
        "Para una mejor experiencia, necesitamos tu ubicación. ¿Deseas continuar?"
      );
      if (confirmed) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setForm(prev => ({
              ...prev,
              latitud: position.coords.latitude.toString(),
              longitud: position.coords.longitude.toString(),
            }));
          },
          (error) => {
            console.error("Error al obtener ubicación:", error);
            setForm(prev => ({
              ...prev,
              latitud: "0",
              longitud: "0"
            }));
          }
        );
      } else {
        setForm(prev => ({
          ...prev,
          latitud: "0",
          longitud: "0"
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        latitud: "0",
        longitud: "0"
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validaciones frontend
    if (!form.username) {
      setErrors({...errors, username: "Nombre de usuario requerido"});
      return;
    }
    
    if (!form.email.includes('@')) {
      setErrors({...errors, email: "Email inválido"});
      return;
    }
    
    if (form.password.length < 6) {
      setErrors({...errors, password: "Mínimo 6 caracteres"});
      return;
    }
    
    if (!/^\d{9}$/.test(form.phone)) {
      setErrors({...errors, phone: "Teléfono debe tener 9 dígitos"});
      return;
    }
    
    if (!acceptedTerms) {
      setErrors({...errors, terms: "Debes aceptar los términos"});
      return;
    }
    
    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';
      
      const response = await axios.post(`${apiUrl}/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
        telefono: form.phone,
        latitud: form.latitud,
        longitud: form.longitud,
        auditoria: {
          acepta_terminos: acceptedTerms,
          acepta_politicas: acceptedDataPolicy,
          ip_address: window.location.hostname, 
          navegador_dispositivo: navigator.userAgent
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error en el registro:', error.response?.data);
      
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          backendErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: "Error en el servidor. Intente nuevamente." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value
    }));
  };

  // Estilos (igual que en tu versión original)
  const styles = {
    appContainer: {
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FBFBF8',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      backgroundImage: 'radial-gradient(circle at 25% 60%, rgba(42,157,143,0.08) 0%, transparent 50%)'
    },
    formCard: {
      width: '100%',
      maxWidth: '520px',
      background: '#FFFFFF',
      borderRadius: '18px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
      padding: '50px',
      position: 'relative',
      zIndex: 2,
      border: '1px solid #E0F2E9'
    },
    logoHeader: {
      textAlign: 'center',
      marginBottom: '35px'
    },
    logo: {
      fontSize: '2.4rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #2A9D8F 0%, #64C9B7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      letterSpacing: '-0.5px'
    },
    tagline: {
      color: '#666',
      fontSize: '1.05rem',
      marginTop: '12px',
      letterSpacing: '0.2px'
    },
    inputGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontWeight: 500,
      color: '#2F2F2F',
      fontSize: '1rem'
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: '10px',
      border: '1px solid #DADAD5',
      fontSize: '1.05rem',
      transition: 'all 0.3s'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '15px 0'
    },
    checkboxLabel: {
      fontSize: '0.95rem',
      cursor: 'pointer',
      userSelect: 'none'
    },
    checkboxLink: {
      background: 'none',
      border: 'none',
      color: '#2A9D8F',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: 0,
      fontSize: '0.95rem'
    },
    error: {
      color: '#E53E3E',
      fontSize: '0.85rem',
      marginTop: '5px'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #2A9D8F 0%, #64C9B7 100%)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.05rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'all 0.3s'
    },
    footerText: {
      textAlign: 'center',
      marginTop: '30px',
      color: '#666',
      fontSize: '1rem'
    },
    loginLink: {
      color: '#2A9D8F',
      fontWeight: 600,
      cursor: 'pointer'
    },
    decorativeCircle: {
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #E0F2E9 0%, transparent 70%)',
      zIndex: 1,
      opacity: 0.6
    },
    successMessage: {
      color: '#2A9D8F',
      textAlign: 'center',
      marginBottom: '20px',
      fontWeight: 500
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Elementos decorativos animados */}
      <motion.div
        style={{
          ...styles.decorativeCircle,
          top: '-100px',
          left: '-100px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      />
      
      <motion.div
        style={{
          ...styles.decorativeCircle,
          bottom: '-100px',
          right: '-100px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.3, duration: 1.5 }}
      />

      {/* Tarjeta principal con animación */}
      <motion.div
        style={styles.formCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo y eslogan animados */}
        <motion.div
          style={styles.logoHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={styles.logo}>EmprendePe</div>
          <div style={styles.tagline}>Transforma tus ideas en negocios exitosos</div>
        </motion.div>
        
        {/* Mensaje de éxito */}
        {successMessage && (
          <motion.div
            style={styles.successMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {successMessage}
          </motion.div>
        )}

        {/* Error general */}
        {errors.general && (
          <motion.div
            style={{ ...styles.error, textAlign: 'center', marginBottom: '20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors.general}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campos del formulario con animación escalonada */}
          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label style={styles.label}>Nombre de usuario</label>
            <motion.input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ej: mi_emprendimiento"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ 
                borderColor: '#2A9D8F',
                boxShadow: '0 0 0 3px rgba(42, 157, 143, 0.2)'
              }}
            />
            {errors.username && <div style={styles.error}>{errors.username}</div>}
          </motion.div>

          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label style={styles.label}>Correo electrónico</label>
            <motion.input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="tucorreo@negocio.com"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ 
                borderColor: '#2A9D8F',
                boxShadow: '0 0 0 3px rgba(42, 157, 143, 0.2)'
              }}
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </motion.div>

          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label style={styles.label}>Contraseña</label>
            <motion.input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Crea una contraseña segura"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ 
                borderColor: '#2A9D8F',
                boxShadow: '0 0 0 3px rgba(42, 157, 143, 0.2)'
              }}
            />
            {errors.password && <div style={styles.error}>{errors.password}</div>}
          </motion.div>

          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label style={styles.label}>Teléfono</label>
            <motion.input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={9}
              required
              style={styles.input}
              placeholder="912 345 678"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ 
                borderColor: '#2A9D8F',
                boxShadow: '0 0 0 3px rgba(42, 157, 143, 0.2)'
              }}
            />
            {errors.phone && <div style={styles.error}>{errors.phone}</div>}
          </motion.div>

          {/* Campos ocultos para geolocalización */}
          <input type="hidden" name="latitud" value={form.latitud} />
          <input type="hidden" name="longitud" value={form.longitud} />

          {/* Checkbox unificado para términos y privacidad */}
          <motion.div
            style={styles.checkboxContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="terms" style={styles.checkboxLabel}>
              Acepto los <button type="button" style={styles.checkboxLink} onClick={() => document.getElementById('termsModal').showModal()}>Términos y Condiciones</button> y la{' '}
              <button type="button" style={styles.checkboxLink} onClick={() => document.getElementById('privacyModal').showModal()}>Política de Privacidad</button>
            </label>
          </motion.div>
          {errors.terms && <div style={styles.error}>{errors.terms}</div>}

          {/* Checkbox adicional para tratamiento de datos */}
          <motion.div
            style={styles.checkboxContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <input
              type="checkbox"
              id="dataPolicy"
              checked={acceptedDataPolicy}
              onChange={(e) => setAcceptedDataPolicy(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="dataPolicy" style={styles.checkboxLabel}>
              Acepto la <button type="button" style={styles.checkboxLink} onClick={() => document.getElementById('dataPolicyModal').showModal()}>Política de Tratamiento de Datos</button> con fines adicionales
            </label>
          </motion.div>

          {/* Botón con animaciones */}
          <motion.button
            type="submit"
            style={styles.submitButton}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ 
              y: -3,
              boxShadow: '0 6px 20px rgba(42, 157, 143, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            Registrarse
          </motion.button>
        </form>

        {/* Pie de página animado */}
        <motion.p
          style={styles.footerText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          ¿Ya tienes una cuenta?{' '}
          <motion.span 
            style={styles.loginLink}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/login')}
          >
            Inicia sesión aquí
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Modales para términos y políticas */}
      <TermsModal type="terms" id="termsModal" />
      <TermsModal type="privacy" id="privacyModal" />
      <TermsModal type="dataPolicy" id="dataPolicyModal" />
    </div>
  );
};

export default Register;