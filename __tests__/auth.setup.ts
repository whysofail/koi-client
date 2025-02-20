import { test as setup } from "@playwright/test";
import path from "path";

const adminFile = path.join(__dirname, "../playwright/.auth/admin.json");
const userFile = path.join(__dirname, "../playwright/.auth/user.json");

const ADMIN_EMAIL = "admin-0@mail.com";
const ADMIN_PASS = "Adminuser-0";

const USER_EMAIL = "user-0@mail.com";
const USER_PASS = "Regularuser-0";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASS);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: adminFile });
});

setup("authenticate as user", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill(USER_EMAIL);
  await page.locator('input[name="password"]').fill(USER_PASS);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: userFile });
});
