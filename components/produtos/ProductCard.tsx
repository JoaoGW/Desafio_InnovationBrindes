import { useState } from "react";
import { Heart, AlertCircle } from "lucide-react";

import { Product } from "@/services/produtos.services";
import { formatPrecoParaTela } from "@/services/produtos.utils";

import ProductModal from "@/components/produtos/ProductModal";

import { useFavoritesStore } from "@/store/favoritos.store";

const CORES = [
  "#1f7fd0",
  "#29a85d",
  "#111111",
  "#f28a00",
  "#e8475c",
  "#6a7d2a",
];

export default function ProductCard({ product }: { product: Product }) {
  const [corSelecionada, setCorSelecionada] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const productId = product.codigo;

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(productId));

  const preco = formatPrecoParaTela(product.preco);

  return (
    <article className="flex flex-col mb-8">
      <div className="px-1 pb-2 text-center">
        <h3 className="line-clamp-1 text-sm font-bold text-[#1e1e1e]">
          {product.nome}
        </h3>
        <p className="text-xs font-semibold text-[#3a3a3a]">{product.codigo}</p>
      </div>

      <div className="flex flex-1 flex-col border border-[#d8d8d8] bg-[#fafafa] px-3 pb-3 pt-2">
        <div className="-mx-3 -mt-2 relative h-[190px] w-[calc(100%+1.5rem)] overflow-hidden bg-[#f4f4f4]">
          {!imagemCarregada && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#e8e8e8] text-[#999999]">
              <AlertCircle size={32} className="mb-1" />
              <span className="text-[10px] font-semibold">
                Imagem indisponível
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => toggleFavorite(productId)}
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#4d4d4d] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#76b900]"
          >
            <Heart
              size={16}
              className={
                isFavorite ? "fill-[#e8475c] text-[#e8475c]" : "text-[#4d4d4d]"
              }
            />
          </button>

          <img
            src={product.imagem}
            alt={product.nome}
            onError={() => setImagemCarregada(false)}
            className={`h-full w-full object-cover ${!imagemCarregada ? "hidden" : ""}`}
            loading="lazy"
          />
          <span className="absolute right-2 top-2 rounded bg-[#ececec]/80 px-1.5 py-0.5 text-[10px] font-bold text-[#07a6df]">
            EXCLUSIVO!
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[12px] leading-tight text-[#7a7a7a]">
          {product.descricao}
        </p>

        <p className="mt-2 text-[10px] font-semibold text-[#7a7a7a]">Cores:</p>
        <div className="mt-1 flex gap-1">
          {CORES.map((color) => (
            <button
              key={`${product.codigo}-${color}`}
              type="button"
              onClick={() =>
                setCorSelecionada(color === corSelecionada ? null : color)
              }
              aria-label={`Cor ${color}`}
              className="h-5 w-5 rounded-full transition-transform cursor-pointer hover:scale-125"
              style={{
                backgroundColor: color,
                outline:
                  corSelecionada === color ? `2px solid ${color}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>

        <div className="mt-auto pt-2 text-right">
          {preco !== "Indisponível" && (
            <p className="text-[10px] font-semibold text-[#787878]">
              a partir de
            </p>
          )}
          <p className="text-[28px] font-bold leading-none text-[#4d4d4d]">
            {preco}
          </p>
          {preco !== "Indisponível" && (
            <p className="mt-0.5 text-[9px] font-semibold text-[#9a9a9a]">
              gerado pela melhor oferta
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-2 h-8 w-full rounded-sm bg-[#76b900] text-sm font-bold cursor-pointer text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#76b900]/50"
      >
        CONFIRA
      </button>

      <ProductModal
        isOpen={isModalOpen}
        product={product}
        onClose={() => setIsModalOpen(false)}
      />
    </article>
  );
}
