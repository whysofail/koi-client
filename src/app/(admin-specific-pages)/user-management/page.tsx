import React, { FC } from "react";

const UserManagement: FC = () => {
  return (
    <div>
      Only Admins can access this page, otherwise it will show 403 Forbidden
    </div>
  );
};

export default UserManagement;
