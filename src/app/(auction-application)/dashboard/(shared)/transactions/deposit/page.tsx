import BackButton from "@/components/dashboard/BackButton";
import DepositForm from "@/components/user/wallet/deposit-form/DepositForm";
import { getServerSession } from "@/lib/serverSession";
import IsBannedInfo from "@/components/dashboard/IsBanned/IsBannedInfo";

export const metadata = {
  title: "Deposit",
};

const page = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const isBanned = session?.user.is_banned;
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton className="ml-5 mt-5" />
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            Deposits
          </h2>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        {isBanned ? <IsBannedInfo /> : <DepositForm token={token} />}
      </div>
    </>
  );
};

export default page;
