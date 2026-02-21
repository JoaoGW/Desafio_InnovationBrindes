"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";

import Header from "@/components/layout/Header";
import ProductCard from "@/components/produtos/ProductCard";

export default function Produtos() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: products = [], isLoading, isError, refetch } = useProducts();

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

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
