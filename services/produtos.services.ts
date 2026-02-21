import { api } from "./api";

// Tipagem das informações dos produtos recebidas pela API
export type Product = {
  codigo: string;
  nome: string;
  referencia: string;
  codigo_categoria: string;
  imagem: string;
  preco: string;
  descricao: string;
};

/**
 * Busca a listagem de produtos na API protegida.
 *
 * Esta função realiza uma requisição HTTP GET para o endpoint de produtos,
 * enviando o token de autenticação no header `Authorization` no formato
 * `Bearer <token>`.
 *
 * @param token Token de acesso válido do usuário autenticado.
 * @returns Lista de produtos retornada pela API.
 *
 * @throws Propaga erros de requisição (ex.: token inválido/expirado ou falha de rede)
 * para que o tratamento seja feito no hook/componente que chamou a função.
 */
export async function getProdutos(token: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/innova-dinamica/produtos/listar", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}