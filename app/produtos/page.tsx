"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import {
  aplicarFiltroFavoritos,
  getProdutosOrdenados,
  isProdutoValido,
  SortOption,
} from "@/services/produtos.utils";
import { useAuthStore } from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favoritos.store";

import Header from "@/components/layout/Header";
import ProductCard from "@/components/produtos/ProductCard";

// Tamanho da paginação
const PAGE_SIZE = 20;

export default function Produtos() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const favorites = useFavoritesStore((state) => state.favorites);
  const showOnlyFavorites = useFavoritesStore(
    (state) => state.showOnlyFavorites,
  );
  const setShowOnlyFavorites = useFavoritesStore(
    (state) => state.setShowOnlyFavorites,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts(debouncedSearch);

  // Matriz memorizada de produtos de acordo com a resposta dos produtos.
  const products = useMemo(
    () => (Array.isArray(productsResponse) ? productsResponse : []),
    [productsResponse],
  );

  /**
   * Lista de produtos considerados "válidos".
   * Um produto é válido quando pelo menos um dos seus campos principais
   * (codigo, nome, referencia, imagem, preco ou descricao) não está vazio.
   * Isso evita que produtos completamente sem informação sejam exibidos na tela.
   */
  const validProducts = useMemo(
    () => products.filter((product) => isProdutoValido(product)),
    [products],
  );

  const favoriteFilteredProducts = useMemo(() => {
    return aplicarFiltroFavoritos(validProducts, favorites, showOnlyFavorites);
  }, [favorites, showOnlyFavorites, validProducts]);

  // Lista de produtos válidos ordenada de acordo com a opção escolhida pelo usuário (sortBy).
  const sortedProducts = useMemo(
    () => getProdutosOrdenados(favoriteFilteredProducts, sortBy),
    [favoriteFilteredProducts, sortBy],
  );

  // Calcula quantos produtos devem ser exibidos com base na página atual
  const visibleCount = page * PAGE_SIZE;

  // Fatia da lista ordenada que será realmente exibida na tela.
  const visibleProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount],
  );

  // Indica se ainda existem produtos que não foram exibidos (usado para mostrar o botão "Carregar mais")
  const hasMore = visibleCount < sortedProducts.length;

  useEffect(() => {
    // Aguarda o Zustand hidratar (carregar do localStorage)
    if (!isHydrated) return;

    // Após hidratação, valida autenticação
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <Header />
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nome ou código"
              className="h-10 w-full rounded border border-black bg-white pl-9 pr-3 text-sm text-black placeholder:text-black outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <button
              type="button"
              onClick={() => {
                setShowOnlyFavorites(!showOnlyFavorites);
                setPage(1);
              }}
              className={`h-10 cursor-pointer rounded border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#76b900] ${
                showOnlyFavorites
                  ? "border-[#76b900] bg-[#76b900] text-white"
                  : "border-black bg-white text-black"
              }`}
            >
              Mostrar apenas favoritos
            </button>

            <div className="flex flex-col">
              <label htmlFor="sort-select" className="sr-only">
                Ordenar produtos por
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as SortOption);
                  setPage(1);
                }}
                className="h-10 rounded border border-black bg-white px-3 text-sm text-black outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="name-asc">Nome (A → Z)</option>
                <option value="name-desc">Nome (Z → A)</option>
                <option value="price-asc">Preço (menor → maior)</option>
                <option value="price-desc">Preço (maior → menor)</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-95 animate-pulse border border-[#d8d8d8] bg-white"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">
              Não foi possível carregar os produtos.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded bg-[#76b900] px-4 py-2 text-sm font-semibold text-white"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !isError && sortedProducts.length === 0 && (
          <div className="rounded border border-[#d8d8d8] bg-white p-6 text-center text-sm text-[#666666]">
            Nenhum produto encontrado.
          </div>
        )}

        {!isLoading && !isError && sortedProducts.length > 0 && (
          <>
            <div
              data-testid="products-grid"
              className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={`${product.codigo || "sem-codigo"}-${product.referencia || "sem-ref"}-${index}`}
                  product={product}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded bg-[#76b900] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
