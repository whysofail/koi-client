import { FC } from "react";
import ProfileButton from "./ProfileButton";
import NotificationsDropdown from "./NotificationsDropdown";
import ModeToggle from "./ThemeToggle";
import { User } from "next-auth";
interface HeaderProps {
  isAdmin?: boolean;
  user: User;
}

const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <NotificationsDropdown user={user} />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
