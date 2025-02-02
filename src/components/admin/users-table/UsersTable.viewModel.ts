import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useGetAllUsers from "@/server/user/getAllUsers/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
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

  const [sorting, setSorting] = useState<SortingState>([]);
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

  const setOrderBy = useCallback(
    (newOrderBy: UserOrderBy) => {
      router.push(`?${createQueryString("orderBy", newOrderBy)}`);
    },
    [createQueryString, router],
  );

  const setOrder = useCallback(
    (newOrder: "ASC" | "DESC") => {
      router.push(`?${createQueryString("order", newOrder)}`);
    },
    [createQueryString, router],
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

  const { data: PaginatedData, isLoading } = useGetAllUsers({
    token,
    page: pageIndex,
    limit: pageSize,
    registrationDateFrom,
    registrationDateTo,
    orderBy,
    order,
    role,
    isBanned,
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
    setOrderBy,
    order,
    setOrder,
    role,
    setRole,
    isBanned,
    setIsBanned,
    searchColumn,
    setSearchColumn,
    PaginatedData,
    isLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  };
};

export default UsersTableViewModel;
