import { api } from "./api";

// Dados enviados no corpo da requisição de login.
type LoginPayload = {
  email: string;
  senha: string;
};

// Resposta retornada pelo sis de login.
type LoginResponse = {
  status: 0 | 1;
  message: string;
  token_de_acesso: string;
  dados_usuario: {
    codigo_usuario: string;
    nome_usuario: string;
    codigo_grupo: string;
    nome_grupo: string;
  };
};

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Realiza a autenticação do usuário.
 *
 * Faz um POST para o endpoint de login e retorna os dados da resposta.
 * O tratamento de `status === 1` (sucesso) ou `status === 0` (erro)
 * deve ser feito por quem chamar esta função.
 *
 * @param payload - Objeto com `email` e `senha` do usuário.
 * @returns Promessa com os dados retornados pela API, incluindo token e dados do usuário.
 * @throws Lança um erro caso a requisição HTTP falhe (ex.: sem conexão, timeout).
 */
export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/api/innova-dinamica/login/acessar",
    payload
  );
  return data;
}
