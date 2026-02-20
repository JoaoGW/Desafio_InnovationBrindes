import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: "https://apihomolog.innovationbrindes.com.br",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Interceptor de resposta para tratar erros HTTP.
 *
 * Se receber status 401 (não autorizado), limpa o store de autenticação
 * e redireciona para a tela de login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpar dados de autenticação do store
      useAuthStore.getState().logout();

      // Redirecionar para login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
