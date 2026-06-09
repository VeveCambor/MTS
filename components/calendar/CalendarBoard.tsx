"use client";

import { Calendar, Views } from "react-big-calendar";
import Box from "@mui/material/Box";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer, calendarMessages } from "./calendarLocalizer";
import type { CalendarEvent } from "@/lib/utils/schedule";

type CalendarBoardProps = {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
};

export function CalendarBoard({ events, onSelectEvent }: CalendarBoardProps) {
  return (
    <Box
      sx={{
        height: { xs: 520, md: 680 },
        bgcolor: "background.paper",
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        "& .rbc-toolbar button": { color: "text.primary" },
        "& .rbc-off-range-bg": { bgcolor: "action.hover" },
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
        messages={calendarMessages}
        culture="cs"
        startAccessor="start"
        endAccessor="end"
        popup
        onSelectEvent={onSelectEvent}
        style={{ height: "100%" }}
      />
    </Box>
  );
}
