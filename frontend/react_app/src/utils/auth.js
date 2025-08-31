// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // aseguramos quitar también el usuario
};

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
