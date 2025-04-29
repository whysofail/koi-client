import React from "react";

const IsBannedInfo = () => {
  return (
    <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      <strong className="font-bold">Your account has been banned! </strong>
      <span className="block sm:inline">
        You are not allowed to make any transactions.
      </span>
    </div>
  );
};

export default IsBannedInfo;
