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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Negocio />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/asesoria" element={<Asesoria />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/credito" element={<OpcionesCredito />} />
        <Route path="/detalle/:negocioId" element={<DetalleNegocio />} />

      </Routes>
    </Router>
    
  );
}

export default App;
