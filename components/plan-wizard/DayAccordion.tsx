"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useActivities } from "@/hooks/useActivities";
import { useActivityGroups } from "@/hooks/useActivityGroups";
import { useActivityTrainings, useUnitKmFetcher } from "@/hooks/useActivityTrainings";
import { dayDate, formatDayDate } from "@/lib/utils/plan";
import type { WizardActivity, WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
  trainerId: string | undefined;
  activity: WizardActivity;
  updateActivity: (cycle: number, day: number, patch: Partial<WizardActivity>) => void;
  setDayKm: (cycle: number, day: number, km: string) => void;
  removeDay: (cycle: number, day: number) => void;
};

export function DayAccordion({
  state,
  trainerId,
  activity,
  updateActivity,
  setDayKm,
  removeDay,
}: Props) {
  const { autonumCycle: cycle, autonumInCycle: day } = activity;
  const { data: activities } = useActivities();
  const { data: groups } = useActivityGroups(
    activity.activityId ?? "",
    activity.activityId ? trainerId : undefined,
  );
  const { data: trainings } = useActivityTrainings(
    activity.groupId ?? "",
    Boolean(activity.groupId),
  );
  const fetchUnitKm = useUnitKmFetcher();

  const dateLabel = formatDayDate(dayDate(state, cycle, day));
  const sportName = activities?.find((a) => a.id === activity.activityId)?.name;

  const handleActivity = (id: string) =>
    updateActivity(cycle, day, {
      activityId: id || null,
      groupId: null,
      activityTrainingId: null,
      name: "",
    });

  const handleGroup = (id: string) =>
    updateActivity(cycle, day, { groupId: id || null, activityTrainingId: null, name: "" });

  const handleUnit = async (id: string) => {
    const name = trainings?.find((t) => t.id === id)?.name ?? "";
    updateActivity(cycle, day, { activityTrainingId: id || null, name });
    if (id) {
      const km = await fetchUnitKm(id);
      if (km != null) setDayKm(cycle, day, String(km));
    }
  };

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flex: 1, alignItems: "center", justifyContent: "space-between", pr: 1 }}
        >
          <Typography sx={{ fontWeight: 600, textTransform: "capitalize" }}>{dateLabel}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {(activity.name || sportName) && (
              <Typography variant="body2" color="text.secondary">
                {sportName}
                {activity.name ? ` · ${activity.name}` : ""}
              </Typography>
            )}
            <IconButton
              size="small"
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                removeDay(cycle, day);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="Aktivita"
              value={activity.activityId ?? ""}
              onChange={(e) => handleActivity(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              {(activities ?? []).map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Skupina tréninků"
              value={activity.groupId ?? ""}
              onChange={(e) => handleGroup(e.target.value)}
              disabled={!activity.activityId}
              sx={{ minWidth: 160 }}
            >
              {(groups ?? []).map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Tréninková jednotka"
              value={activity.activityTrainingId ?? ""}
              onChange={(e) => handleUnit(e.target.value)}
              disabled={!activity.groupId}
              sx={{ minWidth: 180 }}
            >
              {(trainings ?? []).map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Km"
              value={activity.km}
              onChange={(e) => setDayKm(cycle, day, e.target.value)}
              sx={{ maxWidth: 140 }}
            />
            <TextField
              label="Čas (h:mm)"
              value={activity.time}
              onChange={(e) => updateActivity(cycle, day, { time: e.target.value })}
              placeholder="1:40"
              sx={{ maxWidth: 160 }}
            />
          </Stack>

          <TextField
            label="Poznámka"
            value={activity.description}
            onChange={(e) => updateActivity(cycle, day, { description: e.target.value })}
            multiline
            minRows={1}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
