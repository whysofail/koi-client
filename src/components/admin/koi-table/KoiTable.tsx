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
import { ArrowUpDown, ChevronDown, Loader2, AlertCircle } from "lucide-react";
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
import { Koi } from "@/types/koiTypes";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import KoiTableViewModel from "./KoiTable.viewModel";
import Link from "next/link";

const KoiTable = () => {
  const {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
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
    addToAuctionSearchParams,
    isError,
  } = KoiTableViewModel();

  const columns: ColumnDef<Koi>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "nickname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nickname
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorFn: (row) => row.breeder.name,
      id: "breederName",
      header: "Breeder",
    },
    {
      accessorKey: "variety.name",
      header: "Variety",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const koi = row.original;
        return (
          <Button asChild variant="outline" size="sm">
            <Link
              href={addToAuctionSearchParams(koi.id.toString(), {
                koiCode: koi.code,
                nickname: koi.nickname ?? "",
                gender: koi.gender,
                breeder: koi.breeder.name,
                variety: koi.variety.name,
                size: koi.size,
              })}
            >
              Add to Auction
            </Link>
          </Button>
        );
      },
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
      columnVisibility,
      rowSelection,
    },
    pageCount: Math.ceil((PaginatedData?.total ?? 0) / pageSize),
    manualPagination: true,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  const searchableColumns = [
    { id: "code", label: "Code" },
    { id: "nickname", label: "Nickname" },
    { id: "breederName", label: "Breeder" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
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
            value={
              (table.getColumn(searchColumn.id)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(searchColumn.id)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns Filter <ChevronDown className="ml-2 h-4 w-4" />
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
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error loading koi data. Please try again later.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : PaginatedData?.data?.length ? (
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
          {Math.ceil((PaginatedData?.total ?? 0) / pageSize)} | Total{" "}
          {PaginatedData?.total ?? 0} items
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(1); // Reset to first page when changing page size
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
              pageIndex >= Math.ceil((PaginatedData?.total ?? 0) / pageSize) ||
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

export default KoiTable;
