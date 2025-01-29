import TransactionsTable from "@/components/admin/transactions-table/TransactionsTable";
import { getServerSession } from "@/lib/serverSession";

const TransactionsPage = async () => {
  const session = await getServerSession();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            Transactions
          </h2>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <TransactionsTable token={session?.user?.accessToken ?? ""} />
      </div>
    </>
  );
};

export default TransactionsPage;
