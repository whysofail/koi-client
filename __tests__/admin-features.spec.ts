import { test, expect } from "@playwright/test";

test.describe("Admin role features", () => {
  test.use({ storageState: "./playwright/.auth/admin.json" });

  test.describe("User Management", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/users");
    });
    test("Filtering features", async ({ page }) => {
      await page.getByRole("combobox").filter({ hasText: "User" }).click();
      await page.getByText("Admin", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?role=admin");

      await page.getByRole("combobox").filter({ hasText: "Admin" }).click();
      await page.getByText("User", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?role=user");

      await page.getByRole("combobox").filter({ hasText: "Active" }).click();
      await page.getByText("Banned", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?isBanned=true");
    });
  });
});
