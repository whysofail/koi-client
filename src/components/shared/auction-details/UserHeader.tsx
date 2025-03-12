import React, { FC } from "react";

const UserHeader: FC<{ title: string; description: string }> = ({}) => {
  return (
    <div className="mb-6">
      <h1>Auction Details</h1>
    </div>
  );
};

export default UserHeader;
