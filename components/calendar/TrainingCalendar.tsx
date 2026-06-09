"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalendarBoard } from "./CalendarBoard";
import { DiaryDialog } from "./DiaryDialog";
import { useProfile } from "@/hooks/useProfile";
import { useTrainees } from "@/hooks/useTrainees";
import { useSchedule } from "@/hooks/useSchedule";
import { useTrainingDiary } from "@/hooks/useTrainingDiary";
import type { CalendarEvent } from "@/lib/utils/schedule";
import type { UserShort } from "@/types/domain";

function fullName(t: UserShort) {
  return [t.first_name, t.last_name].filter(Boolean).join(" ") || t.nick;
}

export function TrainingCalendar() {
  const { profile, isTrainer } = useProfile();
  const { data: trainees } = useTrainees(isTrainer ? profile?.id : undefined);
  const [selectedTrainee, setSelectedTrainee] = useState("");

  const targetUserId = isTrainer ? selectedTrainee || undefined : profile?.id;
  const { data: events, isLoading } = useSchedule(targetUserId);
  const diary = useTrainingDiary(targetUserId);

  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const existing = selected ? diary.byActivity.get(selected.id) : undefined;
  const busy = diary.create.isPending || diary.update.isPending || diary.remove.isPending;

  const handleSave = (note: string) => {
    if (!selected || !targetUserId) return;
    if (existing) {
      diary.update.mutate({ id: existing.id, note }, { onSuccess: () => setSelected(null) });
    } else {
      diary.create.mutate(
        { assign_activity_id: selected.id, user_id: targetUserId, note },
        { onSuccess: () => setSelected(null) },
      );
    }
  };

  const handleDelete = () => {
    if (existing) diary.remove.mutate(existing.id, { onSuccess: () => setSelected(null) });
  };

  return (
    <>
      <PageHeader
        title="Kalendář"
        subtitle={isTrainer ? "Tréninky cvičenců a jejich deník" : "Tvůj tréninkový plán"}
      />

      {isTrainer && (
        <Stack sx={{ mb: 2, maxWidth: 360 }}>
          <TextField
            select
            label="Cvičenec"
            value={selectedTrainee}
            onChange={(e) => setSelectedTrainee(e.target.value)}
          >
            {(trainees ?? []).map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {fullName(t)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      {isTrainer && !selectedTrainee ? (
        <Alert severity="info">Vyber cvičence pro zobrazení jeho kalendáře.</Alert>
      ) : isLoading ? (
        <Skeleton variant="rounded" height={520} />
      ) : (
        <CalendarBoard events={events ?? []} onSelectEvent={setSelected} />
      )}

      {selected && (
        <DiaryDialog
          key={selected.id}
          event={selected}
          initialNote={existing?.note ?? ""}
          hasNote={Boolean(existing)}
          readOnly={isTrainer}
          loading={busy}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
