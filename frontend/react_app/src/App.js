import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Negocio from "./components/Negocio";
import Cuenta from "./pages/Cuenta";

import OpcionesCredito from "./pages/OpcionesCredito";
import Asesoria from "./pages/Asesoria";
import Resultado from "./pages/Resultado";
import Configuracion from "./pages/Configuracion";
import DetalleNegocio from "./pages/DetalleNegocio";
import EditarNegocio from "./components/EditarNegocio";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Negocio /></ProtectedRoute>} />
        <Route path="/cuenta" element={<ProtectedRoute><Cuenta /></ProtectedRoute>} />
        <Route path="/asesoria" element={<ProtectedRoute><Asesoria /></ProtectedRoute>} />
        <Route path="/resultado" element={<ProtectedRoute><Resultado /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
        <Route path="/credito" element={<ProtectedRoute><OpcionesCredito /></ProtectedRoute>} />
        <Route path="/detalle/:negocioId" element={<ProtectedRoute><DetalleNegocio /></ProtectedRoute>} />
        <Route path="/editar-negocio/:id" element={<ProtectedRoute><EditarNegocio /></ProtectedRoute>} />

      </Routes>
    </Router>
    
  );
}

export default App;
