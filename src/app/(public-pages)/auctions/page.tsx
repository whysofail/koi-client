import AuctionContent from "@/components/auctions/AuctionContent";
import { getServerSession } from "@/lib/serverSession";

const AuctionPage = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken;
  return (
    <div className="flex flex-col dark:bg-gray-900">
      <AuctionContent token={token} />
    </div>
  );
};

export default AuctionPage;
