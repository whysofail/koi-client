import { getServerSession } from "@/lib/serverSession";
import TransactionDetails from "@/components/shared/transaction-details/TransactionDetails";

const TransactionsDetailPage = async ({
  params,
}: {
  params: Promise<{ transactionsID: string }>;
}) => {
  const session = await getServerSession();

  const transactionsID = (await params).transactionsID;

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            Transactions Detail
          </h2>
        </div>
      </div>
      {session?.user && (
        <TransactionDetails
          user={session.user}
          transactionId={transactionsID}
        />
      )}
      <div className="mt-8 pl-5 pr-5">transactionId: {transactionsID}</div>
    </>
  );
};

export default TransactionsDetailPage;
