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
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {session?.user && (
        <TransactionDetails
          user={session.user}
          transactionId={transactionsID}
        />
      )}
    </div>
  );
};

export default TransactionsDetailPage;
