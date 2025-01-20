import { Metadata } from "next";
import { KoiManagementTable } from "@/components/admin/koi-table/KoiTable";

export const metadata: Metadata = {
  title: "Auction Management",
  description: "Manage koi auctions and listings",
};

export default async function KoiInventory() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            Koi Inventory
          </h2>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <KoiManagementTable />
      </div>
    </>
  );
}
