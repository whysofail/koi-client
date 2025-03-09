import React, { FC } from "react";

const UserHeader: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
};

export default UserHeader;
