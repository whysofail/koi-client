"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format as formatDate } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { UserOrderBy, UserRole } from "@/types/usersTypes";
import UsersTableViewModel from "./UsersTable.viewModel";
import UserStatusBadge from "./UserStatusBadge";

const UsersTable: React.FC<{ token: string }> = ({ token }) => {
  const {
    orderBy,
    order,
    setOrderBy,
    setOrder,
    PaginatedData,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    isLoading,
    pageSize,
    searchColumn,
    setSearchColumn,
    registrationDateFrom,
    registrationDateTo,
    setRegistrationDateFrom,
    setRegistrationDateTo,
    setPageIndex,
    pageIndex,
    setPageSize,
    role,
    setRole,
    isBanned,
    setIsBanned,
  } = UsersTableViewModel(token);

  const getSortIcon = (columnOrderBy: UserOrderBy) => {
    if (orderBy !== columnOrderBy)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return order === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user_id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            setOrderBy(UserOrderBy.USERNAME);
            setOrder(
              orderBy === UserOrderBy.USERNAME && order === "ASC"
                ? "DESC"
                : "ASC",
            );
          }}
        >
          Username
          {getSortIcon(UserOrderBy.USERNAME)}
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            setOrderBy(UserOrderBy.EMAIL);
            setOrder(
              orderBy === UserOrderBy.EMAIL && order === "ASC" ? "DESC" : "ASC",
            );
          }}
        >
          Email
          {getSortIcon(UserOrderBy.EMAIL)}
        </Button>
      ),
    },
    {
      accessorKey: "is_banned",
      header: "Status",
      cell: ({ row }) => (
        <UserStatusBadge isBanned={row.getValue("is_banned")} />
      ),
    },
    {
      accessorKey: "registration_date",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            setOrderBy(UserOrderBy.REGISTRATION_DATE);
            setOrder(
              orderBy === UserOrderBy.REGISTRATION_DATE && order === "ASC"
                ? "DESC"
                : "ASC",
            );
          }}
        >
          Registration Date
          {getSortIcon(UserOrderBy.REGISTRATION_DATE)}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {formatDate(
            new Date(row.getValue("registration_date")),
            "dd-MM-yyyy",
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: PaginatedData?.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        user_id: false, // Hide the user_id column by default
        ...columnVisibility,
      },
      rowSelection,
    },
    pageCount: Math.ceil((PaginatedData?.count ?? 0) / pageSize),
    manualPagination: true,
  });

  // Add type safety for searchable columns
  const searchableColumns = [
    { id: "username", label: "Username" },
    { id: "email", label: "Email" },
  ] as const;

  // Update the search input handling
  const currentColumn = table.getColumn(searchColumn.id);
  const searchValue = (currentColumn?.getFilterValue() as string) ?? "";

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Role filter */}
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.USER}>User</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={isBanned ? "banned" : "active"}
            onValueChange={(value) => setIsBanned(value === "banned")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          {/* Search controls */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  Search by {searchColumn.label}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {searchableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={searchColumn.id === column.id}
                    onCheckedChange={() => setSearchColumn(column)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              placeholder={`Search by ${searchColumn.label}...`}
              value={searchValue}
              onChange={(event) => {
                const column = table.getColumn(searchColumn.id);
                if (column) {
                  column.setFilterValue(event.target.value);
                }
              }}
              className="max-w-sm"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {registrationDateFrom
                  ? formatDate(registrationDateFrom, "dd-MM-yyyy")
                  : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={registrationDateFrom}
                onSelect={setRegistrationDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {registrationDateTo
                  ? formatDate(registrationDateTo, "dd-MM-yyyy")
                  : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={registrationDateTo}
                onSelect={setRegistrationDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <Eye className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Change the border styling here */}
      <div className="relative rounded-md border dark:border-neutral-700">
        {isLoading && (
          <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {PaginatedData?.data?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {pageIndex} of{" "}
          {Math.ceil((PaginatedData?.count ?? 0) / pageSize)} | Total{" "}
          {PaginatedData?.count ?? 0} items
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={
              pageIndex >= Math.ceil((PaginatedData?.count ?? 0) / pageSize) ||
              isLoading
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
