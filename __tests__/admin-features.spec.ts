import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "admin-0@mail.com";

test.describe("Admin Login functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("body").click();
    await page.goto(`${BASE_URL}/login`);
  });
  test("Wrong credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(ADMIN_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorToast = page.getByRole("listitem");
    await expect(errorToast).toHaveText("Invalid email or password");
  });
  test("Correct credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(ADMIN_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill("Adminuser-0");
    await page.getByRole("button", { name: "Sign In" }).click();

    const successToast = page.getByRole("listitem");
    await expect(successToast).toHaveText("Login successful");

    await page.waitForURL(`${BASE_URL}/dashboard`);
  });
});
