"use client";
import { useQuery } from "@tanstack/react-query";
import { getProdutos, getProdutosFiltrados } from "@/services/produtos.services";
import { useAuthStore } from "@/store/auth.store";

// Busca a lista de produtos usando o token salvo no store.
export function useProducts(searchTerm = "") {
  const token = useAuthStore((state) => state.token);
  const busca = searchTerm.trim();

  return useQuery({
    queryKey: ["products", busca],
    queryFn: () =>
      busca ? getProdutosFiltrados(token as string, busca) : getProdutos(token as string),
    enabled: !!token,
  });
}