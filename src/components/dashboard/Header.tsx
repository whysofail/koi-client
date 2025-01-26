import React from "react";
import ProfileButton from "./ProfileButton";
import NotificationsDropdown from "./NotificationsDropdown";
import ModeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header>
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <NotificationsDropdown />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
