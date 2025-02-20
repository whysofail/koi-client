import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin-0@mail.com";
const ADMIN_PASS = "Adminuser-0";

const USER_EMAIL = "user-0@mail.com";
const USER_PASS = "Regularuser-0";

// HEADED MODE ONLY
test.describe("Admin Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Protected route redirect", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("Wrong credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(ADMIN_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorToast = page
      .getByRole("region", { name: "Notifications alt+T" })
      .getByRole("listitem");
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toHaveText("Invalid email or password");
  });

  test("Correct credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(ADMIN_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill(ADMIN_PASS);
    await page.getByRole("button", { name: "Sign In" }).click();

    const successToast = page
      .getByRole("region", { name: "Notifications alt+T" })
      .getByRole("listitem");

    // Increase timeout and add error message
    await expect(successToast).toBeVisible({ timeout: 10000 });
    await expect(successToast).toHaveText("Login successful");
    await expect(page).toHaveURL("/dashboard");
  });
});

test.describe("User Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Protected route redirect", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });
  test("Wrong credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(USER_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorToast = page
      .getByRole("region", { name: "Notifications alt+T" })
      .getByRole("listitem");
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toHaveText("Invalid email or password");
  });
  test("Correct credentials login", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(USER_EMAIL);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.locator('input[name="password"]').fill(USER_PASS);
    await page.getByRole("button", { name: "Sign In" }).click();

    const successToast = page
      .getByRole("region", { name: "Notifications alt+T" })
      .getByRole("listitem");
    await expect(successToast).toBeVisible();
    await expect(successToast).toHaveText("Login successful");
    await expect(page).toHaveURL("/dashboard");
  });
});

test.describe("Admin logout", () => {
  test.use({ storageState: "./playwright/.auth/admin.json" });

  test("Logout", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "admin-0" }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("User logout", () => {
  test.use({ storageState: "./playwright/.auth/user.json" });

  test("Logout", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "user-0" }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL("/login");
  });
});
