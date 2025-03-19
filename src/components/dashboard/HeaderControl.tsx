import { FC } from "react";
import ProfileButton from "./ProfileButton";
import NotificationsDropdown from "./NotificationsDropdown";
import ThemeToggle from "./ThemeToggle";
import { User } from "next-auth";

interface HeaderProps {
  isAdmin?: boolean;
  user: User;
}

const HeaderControl: FC<HeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
        <div className="xs:block hidden sm:block">
          <ThemeToggle />
        </div>
        <NotificationsDropdown user={user} />
        <ProfileButton />
      </div>
    </div>
  );
};

export default HeaderControl;
