export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export const updateDateTime = (
  date: Date | undefined,
  timeString: string,
  onChange: (...event: any[]) => void,
) => {
  if (!date) return;

  try {
    const [hours, minutes] = timeString.split(":").map(Number);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const timezoneOffset = new Date().getTimezoneOffset();

      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);

      const adjustedDate = new Date(
        newDate.getTime() - timezoneOffset * 60 * 1000,
      );
      onChange(adjustedDate.toISOString().split(".")[0]);
    } else {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      onChange(newDate.toISOString().split(".")[0]);
    }
  } catch (error) {
    console.error("Error updating datetime:", error);
  }
};
