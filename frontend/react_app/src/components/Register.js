import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TermsModal from "../components/TermsModal";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    telefono: "",
    latitud: "",
    longitud: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    try {
      await axios.post("http://localhost:9000/register/", form);
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (err) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Crear una cuenta
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="username"
                        className="form-control form-control-lg"
                        placeholder="Tu nombre de usuario"
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="username">
                        Nombre de usuario
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="Tu correo electrónico"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="email">
                        Correo electrónico
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="password">
                        Contraseña
                      </label>
                    </div>

                    {/* Campo Teléfono */}
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="telefono"
                        className="form-control form-control-lg"
                        placeholder="Tu número de teléfono"
                        value={form.telefono}
                        onChange={(e) =>
                          setForm({ ...form, telefono: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="telefono">
                        Teléfono
                      </label>
                    </div>

                    {/* Campos de Latitud y Longitud */}
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="latitud"
                        className="form-control form-control-lg"
                        placeholder="Tu latitud"
                        value={form.latitud}
                        onChange={(e) =>
                          setForm({ ...form, latitud: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="latitud">
                        Latitud
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="longitud"
                        className="form-control form-control-lg"
                        placeholder="Tu longitud"
                        value={form.longitud}
                        onChange={(e) =>
                          setForm({ ...form, longitud: e.target.value })
                        }
                      />
                      <label className="form-label" htmlFor="longitud">
                        Longitud
                      </label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-5">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        Acepto los{" "}
                        <button
                          type="button"
                          className="btn btn-link text-body p-0"
                          data-bs-toggle="modal"
                          data-bs-target="#termsModal"
                        >
                          <u>Términos del servicio</u>
                        </button>
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Registrarse
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      ¿Ya tienes una cuenta?{" "}
                      <button
                        type="button"
                        className="btn btn-link fw-bold text-body p-0"
                        onClick={() => navigate("/login")}
                      >
                        <u>Inicia sesión aquí</u>
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal separado */}
      <TermsModal />
    </section>
  );
}

export default Register;
