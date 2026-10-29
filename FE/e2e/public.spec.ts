import { expect, test } from '@playwright/test';

test('desde Inicio permite buscar una especialidad', async ({ page }) => {
  await page.route('http://localhost:3000/especialidad', (route) =>
    route.fulfill({
      json: [
        { cod_especialidad: 1, nombre: 'Cardiología' },
        { cod_especialidad: 2, nombre: 'Pediatría' },
      ],
    }),
  );

  await page.goto('/');
  await page.getByRole('link', { name: 'Ver Especialidades' }).click();

  await expect(page).toHaveURL('/especialidades');
  await expect(page.getByRole('heading', { name: /Un especialista para/ })).toBeVisible();
  await page.getByPlaceholder(/Buscar por especialidad/).fill('pedi');

  await expect(page.getByRole('heading', { name: 'Pediatría' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cardiología' })).toHaveCount(0);
});

test('Agendar Turno Online desde Nosotros abre el inicio de sesión', async ({ page }) => {
  await page.goto('/nosotros');
  await page.getByRole('link', { name: 'Agendar Turno Online' }).click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeVisible();
});
