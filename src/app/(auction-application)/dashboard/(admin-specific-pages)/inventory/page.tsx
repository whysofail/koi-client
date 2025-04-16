import KoiTable from "@/components/admin/koi-table/KoiTable";

export const metadata = {
  title: "Koi Inventory",
  description: "Koi Inventory",
};

const KoiInventoryPage = () => (
  <>
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
          Koi Inventory
        </h2>
      </div>
    </div>
    <div className="mt-8 pl-5 pr-5">
      <KoiTable />
    </div>
  </>
);

export default KoiInventoryPage;
