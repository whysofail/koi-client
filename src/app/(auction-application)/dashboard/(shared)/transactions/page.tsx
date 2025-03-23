import TransactionsTable from "@/components/admin/transactions-table/TransactionsTable";
import IsBannedInfo from "@/components/dashboard/IsBanned/IsBannedInfo";
import WalletCard from "@/components/user/wallet/wallet-card/WalletCard";
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
      {session?.user.is_banned && (
        <div className="mt-8 pl-5 pr-5">
          <IsBannedInfo />
        </div>
      )}
      {session?.user.role === "user" && (
        <div className="flex items-center justify-between space-y-2">
          <div className="flex-1 space-y-4 p-6 pt-6">
            <WalletCard token={session.user.accessToken} />
          </div>
        </div>
      )}
      <div className="mt-8 pl-5 pr-5">
        {session?.user && <TransactionsTable user={session.user} />}
      </div>
    </>
  );
};

export default TransactionsPage;
