import { useEffect, useState } from "react";
import { differenceInSeconds, isPast, parseISO } from "date-fns";
import { AuctionStatus } from "@/types/auctionTypes";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownProps {
  startDate: string;
  endDate: string;
  status: AuctionStatus;
  className?: string;
  size?: "default" | "large" | "xlarge";
}

const Countdown: React.FC<CountdownProps> = ({
  startDate,
  endDate,
  status,
  className,
  size = "default",
}) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [countdownType, setCountdownType] = useState<
    "toStart" | "toEnd" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const startTime = parseISO(startDate);
      const endTime = parseISO(endDate);

      // Handle different auction states
      if (status === "PENDING") {
        setMessage("Pending payment verification");
        setTimeRemaining(null);
        setCountdownType(null);
        return;
      }

      if (status === "COMPLETED") {
        setMessage("Auction completed");
        setTimeRemaining(null);
        setCountdownType(null);
        return;
      }

      if (status === "FAILED") {
        setMessage("Auction failed");
        setTimeRemaining(null);
        setCountdownType(null);
        return;
      }

      if (isPast(endTime)) {
        setMessage("Auction ended");
        setTimeRemaining(null);
        setCountdownType(null);
        return;
      }

      // If auction hasn't started yet, countdown to start
      if (!isPast(startTime)) {
        const totalSeconds = differenceInSeconds(startTime, now);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeRemaining({ hours, minutes, seconds });
        setCountdownType("toStart");
        setMessage(null);
        return;
      }

      // If auction has started but not ended, countdown to end
      if (isPast(startTime) && !isPast(endTime)) {
        const totalSeconds = differenceInSeconds(endTime, now);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeRemaining({ hours, minutes, seconds });
        setCountdownType("toEnd");
        setMessage(null);
        return;
      }
    };

    updateCountdown(); // Initial update
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate, status]);

  const getStateInfo = () => {
    if (!timeRemaining)
      return {
        textColor: "text-gray-700 dark:text-gray-300",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        borderColor: "border-gray-200 dark:border-gray-700",
        animation: "",
        iconColor: "text-gray-500 dark:text-gray-400",
      };

    if (countdownType === "toStart")
      return {
        textColor: "text-blue-700 dark:text-blue-300",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-100 dark:border-blue-900",
        animation: "animate-gradient-blue",
        iconColor: "text-blue-600 dark:text-blue-400",
      };

    const totalSeconds =
      timeRemaining.hours * 3600 +
      timeRemaining.minutes * 60 +
      timeRemaining.seconds;

    if (totalSeconds <= 300)
      return {
        textColor: "text-red-700 dark:text-red-300",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-100 dark:border-red-900",
        animation: "animate-pulse animate-gradient-red",
        iconColor: "text-red-600 dark:text-red-400",
      };

    if (totalSeconds <= 600)
      return {
        textColor: "text-amber-700 dark:text-amber-300",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-100 dark:border-amber-900",
        animation: "animate-gradient-amber",
        iconColor: "text-amber-600 dark:text-amber-400",
      };

    return {
      textColor: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      borderColor: "border-emerald-100 dark:border-emerald-900",
      animation: "animate-gradient-emerald",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    };
  };

  const formatTime = () => {
    if (!timeRemaining) return "";

    const { hours, minutes, seconds } = timeRemaining;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const sizeClasses = {
    default: {
      container: "px-3 py-1.5 text-sm",
      icon: "h-4 w-4",
      text: "text-sm",
      time: "text-sm font-bold",
    },
    large: {
      container: "px-4 py-2.5 text-base",
      icon: "h-5 w-5",
      text: "text-base",
      time: "text-base font-bold",
    },
    xlarge: {
      container: "px-5 py-3 text-lg",
      icon: "h-6 w-6",
      text: "text-lg",
      time: "text-xl font-bold tracking-tight",
    },
  };

  const stateInfo = getStateInfo();
  const sizeInfo = sizeClasses[size];

  return (
    <div
      className={cn(
        "align-center flex items-center justify-center gap-2 rounded-full border shadow-sm transition-all duration-300",
        stateInfo.bgColor,
        stateInfo.borderColor,
        stateInfo.animation,
        sizeInfo.container,
        className,
      )}
    >
      <Clock className={cn(sizeInfo.icon, stateInfo.iconColor)} />

      {message ? (
        <span className={cn("font-medium", stateInfo.textColor, sizeInfo.text)}>
          {message}
        </span>
      ) : timeRemaining ? (
        <div className={cn("flex items-center gap-1.5", stateInfo.textColor)}>
          {countdownType === "toStart" ? (
            <>
              <span className={sizeInfo.text}>Starting in</span>
              <span className={cn("font-mono", sizeInfo.time)}>
                {formatTime()}
              </span>
            </>
          ) : (
            <>
              <span className={sizeInfo.text}>Ending in</span>
              <span className={cn("font-mono", sizeInfo.time)}>
                {formatTime()}
              </span>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Countdown;
