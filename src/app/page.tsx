import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/server/authOptions";

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>
        Your&apos;e logged in as {session?.user?.name} with a role of{" "}
        {session?.user?.role}
      </h1>
    </main>
  );
};

export default Home;
