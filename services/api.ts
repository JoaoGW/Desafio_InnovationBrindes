import axios from "axios";

export const api = axios.create({
  baseURL: "https://apihomolog.innovationbrindes.com.br",
  headers: {
    "Content-Type": "application/json",
  },
});
