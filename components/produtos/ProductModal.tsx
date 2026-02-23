"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, AlertCircle } from "lucide-react";
import { Product } from "@/services/produtos.services";
import { useFavoritesStore } from "@/store/favoritos.store";

// Props básicas para controlar abertura, dados e fechamento da modal.
type ProductModalProps = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

export default function ProductModal({
  isOpen,
  product,
  onClose,
}: ProductModalProps) {
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `product-modal-title-${product.codigo}`;
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(product.codigo),
  );

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const container = modalRef.current;
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const precoNumero = parseFloat(product.preco);
  const precoValido = !isNaN(precoNumero) && precoNumero > 0;
  const preco = precoValido
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(precoNumero)
    : "Indisponível";

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md cursor-default rounded-sm border border-[#d8d8d8] bg-white p-4 shadow-lg"
      >
        <h2
          id={titleId}
          className="border-b border-[#e6e6e6] pb-2 text-lg font-bold text-[#1e1e1e]"
        >
          {product.nome}
        </h2>

        <div className="mt-3 overflow-hidden rounded border border-[#d8d8d8] bg-[#f6f6f6]">
          {!imagemCarregada && (
            <div className="h-48 w-full flex flex-col items-center justify-center bg-[#e8e8e8] text-[#999999]">
              <AlertCircle size={32} className="mb-1" />
              <span className="text-[10px] font-semibold">
                Imagem indisponível
              </span>
            </div>
          )}

          <img
            src={product.imagem}
            alt={product.nome}
            onError={() => setImagemCarregada(false)}
            className={`h-48 w-full object-cover ${!imagemCarregada ? "hidden" : ""}`}
            loading="lazy"
          />
        </div>

        <div className="mt-3 space-y-1 text-sm text-[#4d4d4d]">
          <p>
            <strong>Código:</strong> {product.codigo || "-"}
          </p>
          <p>
            <strong>Referência:</strong> {product.referencia || "-"}
          </p>
          <p>
            <strong>Preço:</strong> {preco}
          </p>
          <p>
            <strong>Descrição:</strong> {product.descricao || "-"}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-[#e6e6e6] pt-3">
          <button
            type="button"
            onClick={() => toggleFavorite(product.codigo)}
            className={`cursor-pointer rounded-sm border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#76b900] ${
              isFavorite
                ? "border-[#e8475c] bg-[#e8475c] text-white"
                : "border-[#d8d8d8] bg-white text-[#4d4d4d] hover:bg-[#f5f5f5]"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Heart
                size={14}
                className={
                  isFavorite ? "fill-white text-white" : "text-[#4d4d4d]"
                }
              />
              {isFavorite ? "Favoritado" : "Favoritar"}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-sm bg-[#76b900] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#76b900]/40"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
