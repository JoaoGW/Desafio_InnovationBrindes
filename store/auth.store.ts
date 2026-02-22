import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipagem dos dados (de API) para o usuário
type User = {
  codigo_usuario: string;
  nome_usuario: string;
  codigo_grupo: string;
  nome_grupo: string;
};

// Tipagem dos dados que serão armazenados e/ou utilizados no workflow do sis de auttenticação
type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setHydrated: () => void;
};

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Store de autenticação usando Zustand com persistência.
 * 
 * @remarks
 * Este store gerencia o estado de autenticação da aplicação, incluindo token do usuário,
 * informações do usuário e status de autenticação. O estado é automaticamente persistido
 * no armazenamento local sob a chave "auth-storage".
 * 
 * @example
 * ```typescript
 * const { token, user, isAuthenticated, setAuth, logout } = useAuthStore();
 * 
 * // Define autenticação
 * setAuth('token123', { id: 1, name: 'John' });
 * 
 * // Logout
 * logout();
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),

      setHydrated: () =>
        set({
          isHydrated: true,
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    },
  ),
);