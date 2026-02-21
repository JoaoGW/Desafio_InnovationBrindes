"use client";
import { useQuery } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtos.services";
import { useAuthStore } from "@/store/auth.store";

// Busca a lista de produtos usando o token salvo no store.
export function useProducts() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProdutos(token as string),
    enabled: !!token,
  });
}