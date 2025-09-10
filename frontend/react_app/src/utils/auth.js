import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};


export function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}



// NUEVAS FUNCIONES 👇
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};



export const getUser_tok = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); 

    return decoded;  
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // en segundos
    return decoded.exp > currentTime; // true si no ha expirado
  } catch (err) {
    console.error("Error decodificando token:", err);
    return false;
  }
}

export function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("rememberMe");
}
