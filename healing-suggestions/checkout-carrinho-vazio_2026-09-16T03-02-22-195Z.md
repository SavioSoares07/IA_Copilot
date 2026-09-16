# Sugestão de correção — checkout-carrinho-vazio

**Data:** 2026-09-16T03:02:22.196Z
**Teste original:** `tests/checkout-carrinho-vazio.spec.ts`

## Diagnóstico

O SauceDemo permite prosseguir para o checkout mesmo com o carrinho vazio. Ao clicar no botão 'Checkout', a aplicação navega diretamente para a página de informações ('checkout-step-one.html') e não exibe nenhuma mensagem de erro de carrinho vazio, causando a falha por timeout na asserção do elemento de texto.

## Correção sugerida

```typescript
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

    // Então o sistema direciona para a etapa de informações do checkout
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
  });
});
```

---
*Sugestão gerada automaticamente pela IA. Revise antes de aplicar.*
