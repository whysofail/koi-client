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
    <div className="flex items-center px-4 pt-1">
      <div className="flex items-center space-x-2">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <NotificationsDropdown user={user} />
        <ProfileButton />
      </div>
    </div>
  );
};

export default HeaderControl;
