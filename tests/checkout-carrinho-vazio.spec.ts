import { test, expect } from '@playwright/test';

test.describe('Processo de Checkout', () => {
  test('Impedir checkout com carrinho vazio', async ({ page }) => {
    // Dado que o usuário está autenticado como "standard_user" na página "inventory.html"
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Quando o usuário acessa o carrinho sem adicionar nenhum produto
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // E clica no botão de checkout
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Então o sistema deve exibir uma mensagem de erro informando que o carrinho está vazio
    await expect(page.getByText(/carrinho está vazio|cart is empty/i)).toBeVisible();

    // E o usuário não deve ser redirecionado para a etapa de informações do comprador
    await expect(page).not.toHaveURL(/.*checkout-step-one.html/);
  });
});