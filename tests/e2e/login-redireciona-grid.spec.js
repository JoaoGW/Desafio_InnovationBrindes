import { test, expect } from "@playwright/test";

test("fluxo de login redireciona e renderiza grid", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByPlaceholder("Usuário")
    .fill(process.env.E2E_USER || "seu-usuario");
  await page
    .getByPlaceholder("Senha")
    .fill(process.env.E2E_PASSWORD || "sua-senha");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/produtos/);
  await expect(page.getByTestId("products-grid")).toBeVisible();
});
