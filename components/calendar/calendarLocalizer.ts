import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { cs } from "date-fns/locale";

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { cs },
});

export const calendarMessages = {
  today: "Dnes",
  previous: "Zpět",
  next: "Další",
  month: "Měsíc",
  week: "Týden",
  day: "Den",
  agenda: "Přehled",
  date: "Datum",
  time: "Čas",
  event: "Trénink",
  noEventsInRange: "Žádné tréninky v tomto období.",
  showMore: (count: number) => `+ další (${count})`,
};
