import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2>Bienvenido al Dashboard</h2>
      <button className="btn btn-danger" onClick={() => {
        logout();
        navigate("/login");
      }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;
