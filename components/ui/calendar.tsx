"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  approvedDates?: string[];
  requestedDates?: string[];
  reportedDates?: string[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  approvedDates = [],
  requestedDates = [],
  reportedDates = [],
  className,
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create array of dates
  const dates = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    dates.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(day);
  }

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isApprovedDate = (day: number | null): boolean => {
    if (!day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return approvedDates.some((date) => date.startsWith(dateString));
  };

  const isRequestedDate = (day: number | null): boolean => {
    if (!day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return requestedDates.some((date) => date.startsWith(dateString));
  };

  const isReportedDate = (day: number | null): boolean => {
    if (!day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return reportedDates.some((date) => date.startsWith(dateString));
  };

  return (
    <div className={cn("p-4", className)}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "h-10 w-10 flex items-center justify-center text-sm rounded-md",
              date === null
                ? "text-transparent"
                : isApprovedDate(date)
                ? "bg-green-100 text-green-800 font-medium border border-green-200"
                : isReportedDate(date)
                ? "bg-amber-100 text-amber-800 font-medium border border-amber-200"
                : isRequestedDate(date)
                ? "bg-orange-100 text-orange-800 font-medium border border-orange-200"
                : date === currentDate.getDate() &&
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-muted"
            )}
          >
            {date}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-muted-foreground">Approved Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span className="text-muted-foreground">Requested Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-amber-100 border border-amber-200 rounded"></div>
          <span className="text-muted-foreground">Reported Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-primary rounded"></div>
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
};
