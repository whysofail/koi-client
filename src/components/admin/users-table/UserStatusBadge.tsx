import { cn } from "@/lib/utils";

const statusStyles = {
  ADMIN: "bg-purple-500/20 text-purple-500",
  USER: "bg-blue-500/20 text-blue-500",
  BANNED: "bg-red-500/20 text-red-500",
  ACTIVE: "bg-green-500/20 text-green-500",
};

interface UserStatusBadgeProps {
  role?: "ADMIN" | "USER";
  isBanned?: boolean;
}

const UserStatusBadge = ({
  role = "USER",
  isBanned = false,
}: UserStatusBadgeProps) => {
  const status = isBanned ? "BANNED" : role === "ADMIN" ? "ADMIN" : "ACTIVE";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
};

export default UserStatusBadge;
