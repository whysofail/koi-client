import { FC } from "react";
import ProfileButton from "./ProfileButton";
import NotificationsDropdown from "./NotificationsDropdown";
// import ThemeToggle from "./ThemeToggle";
import { User } from "next-auth";
interface HeaderProps {
  isAdmin?: boolean;
  user: User;
}

const DashboardHeader: FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div className="flex items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {/* <ThemeToggle /> */}
          <NotificationsDropdown user={user} />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
