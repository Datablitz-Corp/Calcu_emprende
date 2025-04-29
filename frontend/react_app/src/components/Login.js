import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../utils/auth"; // IMPORTANTE

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9000/login/", form);

      if (res.data && res.data.access) {
        setToken(res.data.access);

        // Guarda el usuario (por ahora solo el nombre)
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

  return (
    <section>
      <div
        className="px-4 py-5 px-md-5 text-center text-lg-start"
        style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
      >
        <div className="container">
          <div className="row gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="my-5 display-3 fw-bold ls-tight">
                Bienvenido de nuevo <br />
                <span className="text-primary">al Panel de Control</span>
              </h1>
              <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                Inicia sesión con tus credenciales para acceder a tu cuenta y
                gestionar todo desde el dashboard.
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card">
                <div className="card-body py-5 px-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        placeholder="Usuario"
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                        required
                      />
                      <label className="form-label" htmlFor="username">
                        Nombre de usuario
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                      />
                      <label className="form-label" htmlFor="password">
                        Contraseña
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4 w-100"
                    >
                      Iniciar Sesión
                    </button>

                    <div className="text-center">
                      <p className="mb-0">¿No tienes cuenta?</p>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate("/register")}
                      >
                        Regístrate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;