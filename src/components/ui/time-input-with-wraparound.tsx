import React, { KeyboardEvent, useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeInputWithWraparound: React.FC<TimeInputProps> = ({
  value = "00:00",
  onChange,
  className,
}) => {
  // Parse initial value
  const [hours, minutes] = value.split(":").map((v) => parseInt(v, 10));

  const [hoursValue, setHoursValue] = useState<string>(
    hours.toString().padStart(2, "0"),
  );
  const [minutesValue, setMinutesValue] = useState<string>(
    minutes.toString().padStart(2, "0"),
  );

  // Update internal state when external value changes
  useEffect(() => {
    const [h, m] = value.split(":").map((v) => parseInt(v, 10));
    setHoursValue(isNaN(h) ? "00" : h.toString().padStart(2, "0"));
    setMinutesValue(isNaN(m) ? "00" : m.toString().padStart(2, "0"));
  }, [value]);

  // Ensure values are within valid range with wraparound
  const normalizeHours = (val: number): number => {
    if (val < 0) return 23;
    if (val > 23) return 0;
    return val;
  };

  const normalizeMinutes = (val: number): number => {
    if (val < 0) return 59;
    if (val > 59) return 0;
    return val;
  };

  // Increment and decrement functions
  const incrementHours = () => {
    const currentValue = parseInt(hoursValue || "0", 10);
    const newValue = normalizeHours(currentValue + 1);
    const formatted = newValue.toString().padStart(2, "0");
    setHoursValue(formatted);
    onChange(`${formatted}:${minutesValue}`);
  };

  const decrementHours = () => {
    const currentValue = parseInt(hoursValue || "0", 10);
    const newValue = normalizeHours(currentValue - 1);
    const formatted = newValue.toString().padStart(2, "0");
    setHoursValue(formatted);
    onChange(`${formatted}:${minutesValue}`);
  };

  const incrementMinutes = () => {
    const currentValue = parseInt(minutesValue || "0", 10);
    const newValue = normalizeMinutes(currentValue + 1);
    const formatted = newValue.toString().padStart(2, "0");
    setMinutesValue(formatted);
    onChange(`${hoursValue}:${formatted}`);
  };

  const decrementMinutes = () => {
    const currentValue = parseInt(minutesValue || "0", 10);
    const newValue = normalizeMinutes(currentValue - 1);
    const formatted = newValue.toString().padStart(2, "0");
    setMinutesValue(formatted);
    onChange(`${hoursValue}:${formatted}`);
  };

  // Handlers
  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue, 10);

    if (rawValue === "") {
      setHoursValue("");
      return;
    }

    if (isNaN(numericValue)) return;

    const normalized = normalizeHours(numericValue);
    const formatted = normalized.toString().padStart(2, "0");
    setHoursValue(formatted);
    onChange(`${formatted}:${minutesValue}`);
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue, 10);

    if (rawValue === "") {
      setMinutesValue("");
      return;
    }

    if (isNaN(numericValue)) return;

    const normalized = normalizeMinutes(numericValue);
    const formatted = normalized.toString().padStart(2, "0");
    setMinutesValue(formatted);
    onChange(`${hoursValue}:${formatted}`);
  };

  // Handle keyboard up/down arrows for incrementing values
  const handleHoursKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        incrementHours();
      } else {
        decrementHours();
      }
    }
  };

  const handleMinutesKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        incrementMinutes();
      } else {
        decrementMinutes();
      }
    }
  };

  return (
    // Add align-middle to ensure vertical alignment with the calendar button
    <div className={`flex items-center align-middle ${className}`}>
      {/* Hours Input with Up/Down buttons */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full p-0 hover:bg-gray-100"
          onClick={incrementHours}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Input
          type="text"
          value={hoursValue}
          onChange={handleHoursChange}
          onKeyDown={handleHoursKeyDown}
          className="h-8 w-10 border-0 px-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
          inputMode="numeric"
          maxLength={2}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full p-0 hover:bg-gray-100"
          onClick={decrementHours}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <span className="mx-1 font-medium">:</span>

      {/* Minutes Input with Up/Down buttons */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full p-0 hover:bg-gray-100"
          onClick={incrementMinutes}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Input
          type="text"
          value={minutesValue}
          onChange={handleMinutesChange}
          onKeyDown={handleMinutesKeyDown}
          className="h-8 w-10 border-0 px-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
          inputMode="numeric"
          maxLength={2}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full p-0 hover:bg-gray-100"
          onClick={decrementMinutes}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default TimeInputWithWraparound;
