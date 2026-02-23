import test from "node:test";
import assert from "node:assert/strict";

import { formatPrecoParaTela } from "@/services/produtos.utils";

test("ProductCard: exibe preço formatado quando valor é válido", () => {
  const resultado = formatPrecoParaTela("29.9");

  assert.equal(resultado, "R$ 29,90");
});

test("ProductCard: exibe 'Indisponível' quando preço é zero", () => {
  const resultado = formatPrecoParaTela("0");

  assert.equal(resultado, "Indisponível");
});

test("ProductCard: exibe 'Indisponível' quando preço inválido", () => {
  const resultado = formatPrecoParaTela("abc");

  assert.equal(resultado, "Indisponível");
});
