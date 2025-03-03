import { http, HttpResponse, delay } from "msw";
import { test, expect } from "./mockTestFactory";

test.describe.parallel("User Management mock", () => {
  test.use({ storageState: "./playwright/.auth/admin.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/users");
  });

  test("should display loading skeleton while fetching data", async ({
    page,
    worker,
  }) => {
    await worker.use(
      http.get("/api/users", async () => {
        await delay();
      }),
    );

    await expect(page.getByTestId("table-skeleton")).toBeVisible();
  });

  test("should display error message when request fails", async ({
    page,
    worker,
  }) => {
    await worker.use(
      http.get("/api/users", async () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      }),
    );

    await page.waitForSelector('[data-testid="table-skeleton"]', {
      state: "detached",
    });

    await expect(
      page.getByText("Error loading users data. Please try again later."),
    ).toBeVisible();
  });

  test("should display user list with default filters", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("hazel", { exact: true })).toBeVisible();
    await expect(page.getByText("leo", { exact: true })).toBeVisible();
  });

  test.describe("Filter feature", () => {
    test("should filter users by role", async ({ page }) => {
      await page.getByRole("combobox").filter({ hasText: "User" }).click();
      await page.getByText("Admin", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?role=admin");
      await expect(
        page.getByText("admin_charlotte", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();

      await page.getByRole("combobox").filter({ hasText: "Admin" }).click();
      await page.getByText("User", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?role=user");
      await expect(page.getByText("hazel", { exact: true })).toBeVisible();
      await expect(
        page.getByText("admin_charlotte", { exact: true }),
      ).not.toBeVisible();
    });

    test("should filter banned users", async ({ page }) => {
      await page.getByRole("combobox").filter({ hasText: "Active" }).click();
      await page.getByText("Banned", { exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?isBanned=true");
      await expect(page.getByText("theodore", { exact: true })).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();
    });

    test("should filter users by registration date range", async ({ page }) => {
      page.getByRole("combobox").filter({ hasText: "User" });
      await page.getByTestId("date-from-button").click();

      while (
        !(await page
          .getByTestId("date-from-calendar")
          .locator("div")
          .filter({ hasText: "January 2024" })
          .first()
          .isVisible())
      ) {
        await page.getByRole("button", { name: "Previous month" }).click();
      }

      await page
        .getByTestId("date-from-calendar")
        .getByRole("gridcell", { name: "1", exact: true })
        .first()
        .click();

      await page.click("body", { position: { x: 0, y: 0 } });
      await page.getByTestId("date-to-button").click();

      while (
        !(await page
          .getByTestId("date-to-calendar")
          .locator("div")
          .filter({ hasText: "January 2024" })
          .first()
          .isVisible())
      ) {
        await page.getByRole("button", { name: "Previous month" }).click();
      }

      await page
        .getByTestId("date-to-calendar")
        .getByRole("gridcell", { name: "15", exact: true })
        .first()
        .click();

      await expect(page).toHaveURL(
        "/dashboard/users?registrationDateFrom=2024-01-01&registrationDateTo=2024-01-15&role=user",
      );

      // // Verify visible users
      // await expect(page.getByText("admin_jessica")).toBeVisible();
      // await expect(page.getByText("John")).toBeVisible();
      // await expect(page.getByText("Mary")).toBeVisible();
      // await expect(page.getByText("Peter")).toBeVisible();

      // // Verify hidden users
      // await expect(page.getByText("admin_sarah")).not.toBeVisible();
      // await expect(page.getByText("hazel")).not.toBeVisible();
    });

    test("should clear date filter when clicking outside calendar", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "From date" }).click();

      await page.click("body", { position: { x: 0, y: 0 } });

      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "From date" }),
      ).toBeVisible();

      await expect(page).toHaveURL("/dashboard/users");
    });

    test("should show all users when clearing date range", async ({ page }) => {
      await page.getByRole("button", { name: "From date" }).click();

      while (
        (await page
          .locator('div[role="dialog"]')
          .locator("div")
          .filter({ hasText: /^January 2024$/ })
          .count()) === 0
      ) {
        await page
          .getByRole("button", { name: "Go to previous month" })
          .click();
      }

      await page
        .locator('div[role="dialog"]')
        .getByRole("gridcell", { name: "1" })
        .first()
        .click();

      await page.getByRole("button", { name: "To date" }).click();
      await page
        .locator('div[role="dialog"]')
        .getByRole("gridcell", { name: "15" })
        .first()
        .click();

      await expect(page.getByText("hazel")).not.toBeVisible();
      await expect(page.getByText("John")).toBeVisible();

      await page
        .getByRole("button", { name: /\d{2}-\d{2}-\d{4}/ })
        .first()
        .click();
      await page.getByRole("button", { name: "From date" }).click();

      // Verify all users are visible again
      await expect(page.getByText("admin_sarah")).toBeVisible();
      await expect(page.getByText("John")).toBeVisible();
      await expect(page.getByText("hazel")).toBeVisible();
    });
  });
});
