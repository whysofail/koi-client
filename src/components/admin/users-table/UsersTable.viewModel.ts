import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useGetAllUsers from "@/server/user/getAllUsers/queries";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { UserOrderBy, UserRole } from "@/types/usersTypes";
import { format } from "date-fns";

const UsersTableViewModel = (token: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const registrationDateFrom = searchParams.get("registrationDateFrom")
    ? new Date(searchParams.get("registrationDateFrom")!)
    : undefined;
  const registrationDateTo = searchParams.get("registrationDateTo")
    ? new Date(searchParams.get("registrationDateTo")!)
    : undefined;
  const orderBy =
    (searchParams.get("orderBy") as UserOrderBy) ||
    UserOrderBy.REGISTRATION_DATE;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";
  const role = (searchParams.get("role") as UserRole) || UserRole.USER;
  const isBanned = searchParams.get("isBanned") === "true";
  const searchColumn = {
    id: searchParams.get("searchColumn") || "username",
    label: searchParams.get("searchColumnLabel") || "Username",
  };

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const setPageIndex = useCallback(
    (page: number) => {
      router.push(`?${createQueryString("page", page.toString())}`);
    },
    [createQueryString, router],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", limit.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setRegistrationDateFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString(
            "registrationDateFrom",
            format(date, "yyyy-MM-dd"),
          )}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setRegistrationDateTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString("registrationDateTo", format(date, "yyyy-MM-dd"))}`,
        );
      }
    },
    [createQueryString, router],
  );

  const handleSort = useCallback(
    (newOrderBy: UserOrderBy) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentOrderBy = params.get("orderBy") as UserOrderBy;
      const currentOrder = params.get("order") as "ASC" | "DESC";

      if (newOrderBy === currentOrderBy) {
        params.set("order", currentOrder === "ASC" ? "DESC" : "ASC");
      } else {
        params.set("orderBy", newOrderBy);
        params.set("order", "DESC");
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setRole = useCallback(
    (newRole: UserRole) => {
      router.push(`?${createQueryString("role", newRole)}`);
    },
    [createQueryString, router],
  );

  const setIsBanned = useCallback(
    (banned: boolean) => {
      router.push(`?${createQueryString("isBanned", String(banned))}`);
    },
    [createQueryString, router],
  );

  const setSearchColumn = useCallback(
    (column: { id: string; label: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("searchColumn", column.id);
      params.set("searchColumnLabel", column.label);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  interface IUpdateURLSearchParams {
    username: string;
    email: string;
    registration_date: string;
    is_banned: string;
    balance: string;
  }

  const updateURLSearchParams = (
    user_id: string,
    data: IUpdateURLSearchParams,
  ) => {
    const searchParams = new URLSearchParams({
      username: data.username,
      email: data.email,
      registration_date: data.registration_date,
      is_banned: data.is_banned,
      balance: data.balance,
    });

    const url = `/dashboard/users/${user_id}?${searchParams.toString()}`;

    return url;
  };

  const { data: PaginatedData, isLoading } = useGetAllUsers({
    token,
    page: pageIndex, // This will now use whatever page is in the URL
    limit: pageSize,
    role,
    registrationDateFrom,
    registrationDateTo,
    isBanned,
    orderBy,
    order,
  });

  return {
    router,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    registrationDateFrom,
    setRegistrationDateFrom,
    registrationDateTo,
    setRegistrationDateTo,
    orderBy,
    order,
    role,
    setRole,
    isBanned,
    setIsBanned,
    searchColumn,
    setSearchColumn,
    PaginatedData,
    isLoading,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    updateURLSearchParams,
    handleSort,
  };
};

export default UsersTableViewModel;
