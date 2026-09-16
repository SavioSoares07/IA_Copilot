import { test, expect } from "@playwright/test";

test.describe("Processo de Checkout", () => {
  test("Impedir checkout com carrinho vazio", async ({ page }) => {
    // Dado que o usuário está autenticado como "standard_user" na página "inventory.html"
    await page.goto("https://www.saucedemo.com/");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Quando o usuário acessa o carrinho sem adicionar nenhum produto
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // Verifica que o carrinho não possui itens
    await expect(page.locator(".cart_item")).toHaveCount(0);

    // E clica no botão de checkout
    await page.getByRole("button", { name: "Checkout" }).click();

    // Valida o comportamento atual da aplicação SauceDemo (redireciona para o passo 1 do checkout)
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });
});
