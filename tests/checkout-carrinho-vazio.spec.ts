import { test, expect } from '@playwright/test';

test.describe('Checkout de Compras', () => {
  test('Tentativa de checkout com carrinho de compras vazio', async ({ page }) => {
    // Dado que o usuário está na página do carrinho
    await page.goto('/carrinho');

    // E que não há produtos adicionados ao carrinho
    await expect(page.getByRole('listitem')).toHaveCount(0);

    // Quando o usuário clica no botão "Finalizar Compra"
    const checkoutButton = page.getByRole('button', { name: 'Finalizar Compra' });
    await checkoutButton.click();

    // Então o sistema deve exibir a mensagem "Seu carrinho está vazio"
    const emptyCartMessage = page.getByText('Seu carrinho está vazio');
    await expect(emptyCartMessage).toBeVisible();

    // E a aplicação não deve travar ou congelar a navegação
    await expect(checkoutButton).toBeEnabled();
  });
});