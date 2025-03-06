import { http, HttpResponse, delay } from "msw";
import { test, expect } from "./mockTestFactory";

test.describe.parallel("User Management", () => {
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
        "/dashboard/users?registrationDateFrom=2024-01-01&registrationDateTo=2024-01-15",
      );

      await expect(page.getByText("John", { exact: true })).toBeVisible();
      await expect(page.getByText("Mary", { exact: true })).toBeVisible();

      await expect(page.getByText("leo", { exact: true })).not.toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();
    });

    test("should show all users when clearing date range", async ({ page }) => {
      await page.goto(
        "/dashboard/users?registrationDateFrom=2024-01-01&registrationDateTo=2024-01-15",
      );

      await page.getByTestId("reset-date-from").click();
      await expect(page).toHaveURL(
        "/dashboard/users?registrationDateTo=2024-01-15",
      );

      await page.getByTestId("reset-date-to").click();
      await expect(page).toHaveURL("/dashboard/users");

      await expect(page.getByRole("table")).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).toBeVisible();
      await expect(page.getByText("leo", { exact: true })).toBeVisible();
    });
  });

  test.describe("Column visibility feature", () => {
    test("should show initial checked columns", async ({ page }) => {
      await expect(page.getByRole("cell", { name: "Username" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Email" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Balance" })).toBeVisible();
      await expect(
        page.getByRole("cell", { name: "Registration Date" }),
      ).toBeVisible();
    });

    test("should hide all columns", async ({ page }) => {
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Username" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Email" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Balance" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Status" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page
        .getByRole("menuitemcheckbox", { name: "Registration Date" })
        .click();

      await expect(
        page.getByRole("cell", { name: "Username" }),
      ).not.toBeVisible();
      await expect(page.getByRole("cell", { name: "Email" })).not.toBeVisible();
      await expect(
        page.getByRole("cell", { name: "Balance" }),
      ).not.toBeVisible();
      await expect(
        page.getByRole("cell", { name: "Registration Date" }),
      ).not.toBeVisible();
    });

    test("should show all columns", async ({ page }) => {
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Username" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Email" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Balance" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Status" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page
        .getByRole("menuitemcheckbox", { name: "Registration Date" })
        .click();

      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "ID" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Username" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Email" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Balance" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Status" }).click();
      await page.getByRole("button", { name: "Columns" }).click();
      await page
        .getByRole("menuitemcheckbox", { name: "Registration Date" })
        .click();

      await expect(page.getByRole("cell", { name: "Username" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Email" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "Balance" })).toBeVisible();
      await expect(
        page.getByRole("cell", { name: "Registration Date" }),
      ).toBeVisible();
    });
  });

  test.describe("Sort feature", () => {
    test("should sort users by name", async ({ page }) => {
      page.getByRole("button", { name: "Username", exact: true }).click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=username&order=DESC",
      );
      await expect(page.getByText("william", { exact: true })).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();

      page.getByRole("button", { name: "Username", exact: true }).click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=username&order=ASC",
      );
      await expect(page.getByText("John", { exact: true })).toBeVisible();
      await expect(
        page.getByText("william", { exact: true }),
      ).not.toBeVisible();
    });

    test("should sort users by email", async ({ page }) => {
      page.getByRole("button", { name: "Email", exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?orderBy=email&order=DESC");
      await expect(page.getByText("william", { exact: true })).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();

      page.getByRole("button", { name: "Email", exact: true }).click();
      await expect(page).toHaveURL("/dashboard/users?orderBy=email&order=ASC");
      await expect(page.getByText("John", { exact: true })).toBeVisible();
      await expect(
        page.getByText("william", { exact: true }),
      ).not.toBeVisible();
    });

    test("should sort users by balance", async ({ page }) => {
      page.getByRole("button", { name: "Balance", exact: true }).click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=balance&order=DESC",
      );
      await expect(page.getByText("liam", { exact: true })).toBeVisible();
      await expect(page.getByText("John", { exact: true })).not.toBeVisible();

      page.getByRole("button", { name: "Balance", exact: true }).click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=balance&order=ASC",
      );
      await expect(page.getByText("John", { exact: true })).toBeVisible();
      await expect(page.getByText("liam", { exact: true })).not.toBeVisible();
    });

    test("should sort users by registration date", async ({ page }) => {
      page
        .getByRole("button", { name: "Registration Date", exact: true })
        .click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=registration_date&order=DESC",
      );
      await expect(page.getByText("hazel", { exact: true })).toBeVisible();
      await expect(page.getByText("John", { exact: true })).not.toBeVisible();

      page
        .getByRole("button", { name: "Registration Date", exact: true })
        .click();
      await expect(page).toHaveURL(
        "/dashboard/users?orderBy=registration_date&order=ASC",
      );
      await expect(page.getByText("John", { exact: true })).toBeVisible();
      await expect(page.getByText("hazel", { exact: true })).not.toBeVisible();
    });
  });
});
