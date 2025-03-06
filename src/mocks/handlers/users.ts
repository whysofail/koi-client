import { http, HttpResponse, delay } from "msw";
import { parseISO, isWithinInterval } from "date-fns";
import { UserOrderBy } from "@/types/usersTypes";
import { mockUsers } from "../data/userData";

export const usersHandlers = [
  http.get("/api/users", async ({ request }) => {
    await delay();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new HttpResponse(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const role = url.searchParams.get("role");
    const isBanned = url.searchParams.get("isBanned") === "true";
    const registrationDateFrom = url.searchParams.get("registrationDateFrom");
    const registrationDateTo = url.searchParams.get("registrationDateTo");
    const orderBy =
      (url.searchParams.get("orderBy") as UserOrderBy) ||
      UserOrderBy.REGISTRATION_DATE;
    const order = url.searchParams.get("order") || "DESC";

    let filteredUsers = [...mockUsers];

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    if (typeof isBanned === "boolean") {
      filteredUsers = filteredUsers.filter(
        (user) => user.is_banned === isBanned,
      );
    }

    if (registrationDateFrom || registrationDateTo) {
      filteredUsers = filteredUsers.filter((user) => {
        const userDate = parseISO(user.registration_date);
        return isWithinInterval(userDate, {
          start: registrationDateFrom
            ? parseISO(registrationDateFrom)
            : new Date(0),
          end: registrationDateTo ? parseISO(registrationDateTo) : new Date(),
        });
      });
    }

    filteredUsers.sort((a, b) => {
      let compareA, compareB;

      switch (orderBy) {
        case UserOrderBy.USERNAME:
          compareA = a.username;
          compareB = b.username;
          break;
        case UserOrderBy.EMAIL:
          compareA = a.email;
          compareB = b.email;
          break;
        case UserOrderBy.BALANCE:
          compareA = a.wallet?.balance || "0";
          compareB = b.wallet?.balance || "0";
          break;
        case UserOrderBy.IS_BANNED:
          compareA = a.is_banned;
          compareB = b.is_banned;
          break;
        case UserOrderBy.REGISTRATION_DATE:
        default:
          compareA = a.registration_date;
          compareB = b.registration_date;
      }

      const comparison = compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      return order === "ASC" ? comparison : -comparison;
    });

    const start = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);

    return HttpResponse.json({
      status: "success",
      message: "Users retrieved successfully",
      data: paginatedUsers,
      count: filteredUsers.length,
      page,
      limit,
    });
  }),
];
