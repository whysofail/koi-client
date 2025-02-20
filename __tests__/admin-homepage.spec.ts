import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.use({ storageState: "./playwright/.auth/admin.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("should display admin dashboard title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Admin Dashboard", exact: true }),
    ).toBeVisible();
  });

  test("should display sidebar navigation menu items", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /^Dashboard$/, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Notifications$/, exact: true }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /^Users$/, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Inventory$/, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Auctions$/, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Transactions$/, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Bids$/, exact: true }),
    ).toBeVisible();
  });

  test("navigation links should redirect to correct pages", async ({
    page,
  }) => {
    const navigationTests = [
      { name: /^Dashboard$/, url: "/dashboard" },
      { name: /^Notifications$/, url: "/dashboard/notifications" },
      { name: /^Users$/, url: "/dashboard/users" },
      { name: /^Inventory$/, url: "/dashboard/inventory" },
      { name: /^Auctions$/, url: "/dashboard/auctions" },
      { name: /^Transactions$/, url: "/dashboard/transactions" },
      { name: /^Bids$/, url: "/dashboard/bids" },
    ];

    for (const { name, url } of navigationTests) {
      await page.getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(url);
      if (url !== "/dashboard") {
        await page.goto("/dashboard");
      }
    }
  });
});
