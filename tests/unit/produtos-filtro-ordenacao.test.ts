import test from "node:test";
import assert from "node:assert/strict";

import type { Product } from "@/services/produtos.services";
import {
  aplicarFiltroFavoritos,
  getProdutosOrdenados,
  isProdutoValido,
} from "@/services/produtos.utils";

const produtosBase: Product[] = [
  {
    codigo: "10",
    nome: "Caneca",
    referencia: "REF-10",
    codigo_categoria: "A",
    imagem: "img-a",
    preco: "10.00",
    descricao: "Caneca personalizada",
  },
  {
    codigo: "20",
    nome: "Agenda",
    referencia: "REF-20",
    codigo_categoria: "B",
    imagem: "img-b",
    preco: "25.50",
    descricao: "Agenda executiva",
  },
  {
    codigo: "30",
    nome: "Bloco",
    referencia: "REF-30",
    codigo_categoria: "C",
    imagem: "img-c",
    preco: "5.00",
    descricao: "Bloco de notas",
  },
];

test("Filtro: mantém apenas produtos favoritos quando toggle está ativo", () => {
  const resultado = aplicarFiltroFavoritos(produtosBase, ["20", "30"], true);

  assert.equal(resultado.length, 2);
  assert.deepEqual(
    resultado.map((item) => item.codigo),
    ["20", "30"],
  );
});

test("Ordenação: ordena por preço crescente", () => {
  const resultado = getProdutosOrdenados(produtosBase, "price-asc");

  assert.deepEqual(
    resultado.map((item) => item.codigo),
    ["30", "10", "20"],
  );
});

test("Ordenação: ordena por nome decrescente", () => {
  const resultado = getProdutosOrdenados(produtosBase, "name-desc");

  assert.deepEqual(
    resultado.map((item) => item.nome),
    ["Caneca", "Bloco", "Agenda"],
  );
});

test("Validação: produto sem nenhum campo preenchido é inválido", () => {
  const produtoInvalido = {
    codigo: "",
    nome: "",
    referencia: "",
    codigo_categoria: "",
    imagem: "",
    preco: "",
    descricao: "",
  } as Product;

  assert.equal(isProdutoValido(produtoInvalido), false);
});
