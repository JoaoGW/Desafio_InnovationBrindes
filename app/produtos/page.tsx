"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";

import Header from "@/components/layout/Header";
import ProductCard from "@/components/produtos/ProductCard";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const PAGE_SIZE = 20;

export default function Produtos() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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

  const products = useMemo(
    () => (Array.isArray(productsResponse) ? productsResponse : []),
    [productsResponse],
  );

  const validProducts = useMemo(
    () =>
      products.filter((product) => {
        const campos = [
          product?.codigo,
          product?.nome,
          product?.referencia,
          product?.imagem,
          product?.preco,
          product?.descricao,
        ];

        return campos.some((campo) => String(campo ?? "").trim() !== "");
      }),
    [products],
  );

  const sortedProducts = useMemo(() => {
    const getNome = (value?: string) => String(value ?? "");

    const parsePreco = (value?: string) => {
      const numero = parseFloat(String(value ?? ""));
      return Number.isNaN(numero) ? 0 : numero;
    };

    const clonedProducts = [...validProducts];

    switch (sortBy) {
      case "name-desc":
        return clonedProducts.sort((a, b) =>
          getNome(b.nome).localeCompare(getNome(a.nome), "pt-BR"),
        );
      case "price-asc":
        return clonedProducts.sort(
          (a, b) => parsePreco(a.preco) - parsePreco(b.preco),
        );
      case "price-desc":
        return clonedProducts.sort(
          (a, b) => parsePreco(b.preco) - parsePreco(a.preco),
        );
      case "name-asc":
      default:
        return clonedProducts.sort((a, b) =>
          getNome(a.nome).localeCompare(getNome(b.nome), "pt-BR"),
        );
    }
  }, [validProducts, sortBy]);

  const visibleCount = page * PAGE_SIZE;

  const visibleProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount],
  );

  const hasMore = visibleCount < sortedProducts.length;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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

          <select
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
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
