"use client";

import React from "react";
import { DetailedUserWarning } from "@/types/usersTypes";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columnHelper = createColumnHelper<DetailedUserWarning>();

const columns = [
  columnHelper.accessor("reason", {
    header: "Reason",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge
        variant={info.getValue() === "ACTIVE" ? "destructive" : "secondary"}
      >
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "Date Issued",
    cell: (info) => format(new Date(info.getValue()), "PPP"),
  }),
];

const WarningsTable = ({ warnings }: { warnings: DetailedUserWarning[] }) => {
  const table = useReactTable({
    data: warnings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No warnings found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WarningsTable;
