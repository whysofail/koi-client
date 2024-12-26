import React from "react";
import ProfileButton from "./ProfileButton";
import NotificationsDropdown from "./NotificationsDropdown";

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <NotificationsDropdown />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
