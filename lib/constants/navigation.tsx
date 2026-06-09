import type { ReactNode } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TuneIcon from "@mui/icons-material/Tune";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimelineIcon from "@mui/icons-material/Timeline";
import { isTrainer } from "./roles";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

const trainerNav: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> }],
  },
  {
    label: "Šablony",
    items: [
      { label: "Skupiny a jednotky", href: "/templates/training-sport", icon: <FitnessCenterIcon /> },
      { label: "Parametry", href: "/templates/parametr-sport", icon: <TuneIcon /> },
      { label: "Hodnoty cvičenců", href: "/templates/parametr-report", icon: <TimelineIcon /> },
      { label: "Tréninkový plán", href: "/templates/training-plan", icon: <AssignmentIcon /> },
    ],
  },
  {
    items: [
      { label: "Sportovci", href: "/trainees", icon: <GroupIcon /> },
      { label: "Kalendář", href: "/calendar", icon: <CalendarMonthIcon /> },
      { label: "Nastavení", href: "/settings", icon: <SettingsIcon /> },
    ],
  },
];

const traineeNav: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
      { label: "Můj plán", href: "/my-training-plan", icon: <EventNoteIcon /> },
      { label: "Pokrok", href: "/my-progress", icon: <TimelineIcon /> },
      { label: "Kalendář", href: "/calendar", icon: <CalendarMonthIcon /> },
      { label: "Nastavení", href: "/settings", icon: <SettingsIcon /> },
    ],
  },
];

export function getNavSections(role: number | null | undefined): NavSection[] {
  return isTrainer(role) ? trainerNav : traineeNav;
}
