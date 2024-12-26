import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

const ActiveAuctionsTable: FC = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Current Bid</TableHead>
            <TableHead>Your Bid</TableHead>
            <TableHead>Time Left</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Vintage Watch</TableCell>
            <TableCell>$1,200</TableCell>
            <TableCell>$1,150</TableCell>
            <TableCell>2h 15m</TableCell>
            <TableCell>
              <Badge>Outbid</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Art Print</TableCell>
            <TableCell>$350</TableCell>
            <TableCell>$350</TableCell>
            <TableCell>4h 30m</TableCell>
            <TableCell>
              <Badge className="bg-green-500">Winning</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Antique Vase</TableCell>
            <TableCell>$800</TableCell>
            <TableCell>$780</TableCell>
            <TableCell>1d 3h</TableCell>
            <TableCell>
              <Badge variant="outline">Watching</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveAuctionsTable;
