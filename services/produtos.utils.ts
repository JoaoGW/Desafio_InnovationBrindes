/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Funções utilitárias para manipulação de produtos.
 * 
 * Este módulo contém funções puras (sem efeitos colaterais) para processar
 * dados de produtos, permitindo fácil testabilidade e reutilização.
 */

import { Product } from "@/services/produtos.services";

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Opções de ordenação disponíveis para a lista de produtos.
 */
export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Converte uma string de preço para número.
 * 
 * @param value - String contendo o preço (ex: "29.90")
 * @returns Número parseado ou 0 se o valor for inválido
 * 
 * @example
 * ```typescript
 * parsePreco("29.90"); // 29.9
 * parsePreco("abc");   // 0
 * parsePreco("");      // 0
 * ```
 */
export function parsePreco(value?: string): number {
  const numero = parseFloat(String(value ?? ""));
  return Number.isNaN(numero) ? 0 : numero;
}

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Formata o preço do produto para exibição na tela no padrão brasileiro (R$).
 * 
 * @param value - String contendo o preço bruto
 * @returns Preço formatado (ex: "R$ 29,90") ou "Indisponível" se inválido
 * 
 * @example
 * ```typescript
 * formatPrecoParaTela("29.9");  // "R$ 29,90"
 * formatPrecoParaTela("0");     // "Indisponível"
 * formatPrecoParaTela("abc");   // "Indisponível"
 * ```
 */
export function formatPrecoParaTela(value?: string): string {
  const precoNumero = parsePreco(value);

  if (precoNumero <= 0) {
    return "Indisponível";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(precoNumero);
}

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Valida se um produto possui pelo menos um campo preenchido.
 * 
 * Um produto é considerado válido quando qualquer um dos campos principais
 * (código, nome, referência, imagem, preço ou descrição) possui conteúdo.
 * 
 * @param product - Objeto do produto a ser validado
 * @returns `true` se o produto é válido, `false` caso contrário
 * 
 * @example
 * ```typescript
 * isProdutoValido({ codigo: "123", nome: "Caneca", ... }); // true
 * isProdutoValido({ codigo: "", nome: "", ... });          // false
 * ```
 */
export function isProdutoValido(product: Product): boolean {
  const campos = [
    product?.codigo,
    product?.nome,
    product?.referencia,
    product?.imagem,
    product?.preco,
    product?.descricao,
  ];

  return campos.some((campo) => String(campo ?? "").trim() !== "");
}

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Ordena uma lista de produtos de acordo com a opção selecionada.
 * 
 * Cria uma cópia do array original antes de ordenar, garantindo imutabilidade.
 * 
 * @param products - Array de produtos a ser ordenado
 * @param sortBy - Opção de ordenação ("name-asc", "name-desc", "price-asc", "price-desc")
 * @returns Nova lista ordenada
 * 
 * @example
 * ```typescript
 * const produtos = [
 *   { nome: "Caneca", preco: "10.00", ... },
 *   { nome: "Agenda", preco: "25.50", ... }
 * ];
 * 
 * getProdutosOrdenados(produtos, "price-asc");
 * // Retorna ordenado por preço crescente: Caneca, Agenda
 * 
 * getProdutosOrdenados(produtos, "name-desc");
 * // Retorna ordenado por nome decrescente: Caneca, Agenda
 * ```
 */
export function getProdutosOrdenados(
  products: Product[],
  sortBy: SortOption,
): Product[] {
  const getNome = (value?: string) => String(value ?? "");
  const clonedProducts = [...products];

  switch (sortBy) {
    case "name-desc":
      return clonedProducts.sort((a, b) =>
        getNome(b.nome).localeCompare(getNome(a.nome), "pt-BR"),
      );
    case "price-asc":
      return clonedProducts.sort((a, b) => parsePreco(a.preco) - parsePreco(b.preco));
    case "price-desc":
      return clonedProducts.sort((a, b) => parsePreco(b.preco) - parsePreco(a.preco));
    case "name-asc":
    default:
      return clonedProducts.sort((a, b) =>
        getNome(a.nome).localeCompare(getNome(b.nome), "pt-BR"),
      );
  }
}

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Filtra produtos baseado na seleção de favoritos.
 * 
 * @param products - Lista completa de produtos
 * @param favorites - Array com códigos dos produtos favoritados
 * @param showOnlyFavorites - Flag indicando se deve filtrar apenas favoritos
 * @returns Lista filtrada ou completa, dependendo da flag
 * 
 * @example
 * ```typescript
 * const produtos = [
 *   { codigo: "10", nome: "Caneca", ... },
 *   { codigo: "20", nome: "Agenda", ... }
 * ];
 * 
 * aplicarFiltroFavoritos(produtos, ["20"], true);
 * // Retorna apenas [{ codigo: "20", nome: "Agenda", ... }]
 * 
 * aplicarFiltroFavoritos(produtos, ["20"], false);
 * // Retorna todos os produtos
 * ```
 */
export function aplicarFiltroFavoritos(
  products: Product[],
  favorites: string[],
  showOnlyFavorites: boolean,
): Product[] {
  if (!showOnlyFavorites) {
    return products;
  }

  return products.filter((product) => favorites.includes(product.codigo));
}
