import React from "react";
import { Input } from "./input";

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  const [hours, minutes] = value?.split(":").map(Number) || [0, 0];

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Math.max(0, Math.min(23, Number(e.target.value)));
    const formattedHour = newHour.toString().padStart(2, "0");
    onChange(`${formattedHour}:${minutes.toString().padStart(2, "0")}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = Math.max(0, Math.min(59, Number(e.target.value)));
    const formattedMinute = newMinute.toString().padStart(2, "0");
    onChange(`${hours.toString().padStart(2, "0")}:${formattedMinute}`);
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={0}
        max={23}
        value={hours.toString().padStart(2, "0")}
        onChange={handleHourChange}
        disabled={disabled}
        className="w-[4rem]"
      />
      <span>:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={minutes.toString().padStart(2, "0")}
        onChange={handleMinuteChange}
        disabled={disabled}
        className="w-[4rem]"
      />
    </div>
  );
}
