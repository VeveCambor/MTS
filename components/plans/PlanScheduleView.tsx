"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { dayLabel, range } from "@/lib/utils/cycle";

export type ScheduleWeek = {
  autonum_cycle: number;
  expected_km: number | null;
  expected_time: string | null;
  description: string | null;
};

export type ScheduleActivity = {
  autonum_cycle: number;
  autonum_in_cycle: number;
  name: string | null;
  description: string | null;
};

type PlanScheduleViewProps = {
  cycleLength: number;
  numberOfCycles: number;
  weeks: ScheduleWeek[];
  activities: ScheduleActivity[];
};

export function PlanScheduleView({
  cycleLength,
  numberOfCycles,
  weeks,
  activities,
}: PlanScheduleViewProps) {
  return (
    <Stack spacing={2}>
      {range(1, numberOfCycles).map((cycle) => {
        const week = weeks.find((w) => w.autonum_cycle === cycle);
        const cycleActivities = activities
          .filter((a) => a.autonum_cycle === cycle)
          .sort((a, b) => a.autonum_in_cycle - b.autonum_in_cycle);

        return (
          <SpaceCard
            key={cycle}
            title={`Cyklus ${cycle}`}
            subheader={
              week
                ? [
                    week.expected_km != null ? `${week.expected_km} km` : null,
                    week.expected_time ? `čas ${week.expected_time}` : null,
                    week.description,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : undefined
            }
          >
            {cycleActivities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Žádné tréninky v tomto cyklu.
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, width: 140 }}>Den</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Trénink</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Poznámka</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cycleActivities.map((a) => (
                      <TableRow key={`${a.autonum_cycle}-${a.autonum_in_cycle}`}>
                        <TableCell>{dayLabel(a.autonum_in_cycle, cycleLength)}</TableCell>
                        <TableCell>{a.name || "—"}</TableCell>
                        <TableCell>{a.description || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </SpaceCard>
        );
      })}
    </Stack>
  );
}
