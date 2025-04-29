import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken, getUser, logout } from "../utils/auth";

function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      setUser(getUser());
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Barra superior unificada */}
      <div className="bg-dark py-3">
        <div className="container d-flex align-items-center justify-content-between text-white flex-wrap">

          {/* Izquierda: Título y saludo */}
          <div className="me-4">
            <h2 className="fw-bold mb-0">Bienvenido al Dashboard</h2>
            {user && (
              <small>
                Hola, <strong>{user.nombre}</strong> 👋
              </small>
            )}
          </div>

          {/* Centro: navegación */}
          <ul className="navbar-nav d-flex flex-row gap-4 mb-0">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link text-white">Negocios</Link>
            </li>
            <li className="nav-item">
              <Link to="/credito" className="nav-link text-white">Opciones de Credito</Link>
            </li>
            <li className="nav-item">
              <Link to="/asesoria" className="nav-link text-white">Asesoria</Link>
            </li>
            <li className="nav-item">
              <Link to="/resultado" className="nav-link text-white">Resultado</Link>
            </li>
          </ul>

          {/* Derecha: perfil */}
          {user && (
            <div className="dropdown">
              <button
                className="btn btn-dark dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="perfil"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span className="text-white">{user.nombre}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/cuenta")}>
                    Cuenta
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">Configuración</button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mt-4">
        {children}
      </main>
    </>
  );
}

export default Layout;
