import { expect, test } from "@playwright/test";

const responsiveViewports = [320, 375, 390, 768, 1366, 1920];

test("keeps public navigation within each required viewport", async ({ page }) => {
  for (const width of responsiveViewports) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/login");
    expect(await page.locator("body").evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true);
  }
});

test("renders the public authentication entry points", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading")).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "Crear una cuenta" })).toHaveAttribute(
    "href",
    "/register",
  );

  await page.getByRole("link", { name: "Crear una cuenta" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Crea tu cuenta" })).toBeVisible();
  await expect(page.getByLabel("Equipo favorito")).toBeVisible();
});

test("supports keyboard navigation with a visible focus indicator", async ({ page }) => {
  await page.goto("/login");
  await page.keyboard.press("Tab");

  await expect(page.locator(":focus")).toBeVisible();
  await expect(page.locator(":focus")).toHaveCSS("outline-style", "solid");
});

test("shows server-side validation feedback for invalid authentication input", async ({ page }) => {
  await page.goto("/login");

  await page.locator('input[name="email"]').fill("invalid-email");
  await page.locator('input[name="password"]').fill("short");
  await page.locator("form button").click();

  await expect(page.getByRole("status")).toHaveText(/Correo o contrase.*incorrectos/);
});

test("shows server-side validation feedback for an incomplete registration", async ({ page }) => {
  await page.goto("/register");

  await page.locator("form button").click();

  await expect(page.getByRole("status")).toHaveText(/Revisa los datos/);
});

test("renders public empty states without requiring a signed-in user", async ({ page }) => {
  await page.goto("/standings");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/results");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
