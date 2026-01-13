"use client";

import DatePicker from "react-datepicker";

interface LocalizedDatePickerProps {
  id?: string;
  value: string; // ISO format (YYYY-MM-DD)
  onChange: (isoDate: string) => void;
  className?: string;
}

export default function LocalizedDatePicker({ id, value, onChange, className }: LocalizedDatePickerProps) {
  // Convert ISO date string to Date object
  const getDateFromValue = (isoDate: string): Date | null => {
    if (!isoDate) return null;
    const date = new Date(isoDate + "T00:00:00");
    return date;
  };

  // Convert Date object to ISO format string
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  };

  return (
    <DatePicker
      id={id}
      selected={getDateFromValue(value)}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/YYYY"
      className={className}
      calendarStartDay={1} // Monday as first day of the week
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
    />
  );
}
