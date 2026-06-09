"use client";

import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useActivities } from "@/hooks/useActivities";
import { useActivityGroups } from "@/hooks/useActivityGroups";
import { useActivityTrainings } from "@/hooks/useActivityTrainings";
import { useProfile } from "@/hooks/useProfile";

type ActivityUnitPickerProps = {
  value: string | null;
  onChange: (trainingId: string | null, trainingName: string) => void;
};

export function ActivityUnitPicker({ value, onChange }: ActivityUnitPickerProps) {
  const { profile } = useProfile();
  const { data: activities } = useActivities();
  const [activityId, setActivityId] = useState("");
  const [groupId, setGroupId] = useState("");

  const { data: groups } = useActivityGroups(activityId, activityId ? profile?.id : undefined);
  const { data: trainings } = useActivityTrainings(groupId, Boolean(groupId));

  const handleActivity = (id: string) => {
    setActivityId(id);
    setGroupId("");
    onChange(null, "");
  };

  const handleGroup = (id: string) => {
    setGroupId(id);
    onChange(null, "");
  };

  const handleTraining = (id: string) => {
    const name = trainings?.find((t) => t.id === id)?.name ?? "";
    onChange(id || null, name);
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
      <TextField
        select
        size="small"
        label="Sport"
        value={activityId}
        onChange={(e) => handleActivity(e.target.value)}
        sx={{ minWidth: 140 }}
      >
        {(activities ?? []).map((a) => (
          <MenuItem key={a.id} value={a.id}>
            {a.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Skupina"
        value={groupId}
        onChange={(e) => handleGroup(e.target.value)}
        disabled={!activityId}
        sx={{ minWidth: 140 }}
      >
        {(groups ?? []).map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Jednotka"
        value={value ?? ""}
        onChange={(e) => handleTraining(e.target.value)}
        disabled={!groupId}
        sx={{ minWidth: 160 }}
      >
        {(trainings ?? []).map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
