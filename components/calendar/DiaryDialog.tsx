"use client";

import { useState } from "react";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { CalendarEvent } from "@/lib/utils/schedule";

type DiaryDialogProps = {
  event: CalendarEvent;
  initialNote: string;
  hasNote: boolean;
  readOnly?: boolean;
  loading?: boolean;
  onSave: (note: string) => void;
  onDelete: () => void;
  onClose: () => void;
};

export function DiaryDialog({
  event,
  initialNote,
  hasNote,
  readOnly = false,
  loading = false,
  onSave,
  onDelete,
  onClose,
}: DiaryDialogProps) {
  const [note, setNote] = useState(initialNote);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {event.planName} · {format(event.start, "EEEE d. M. yyyy")}
          </Typography>
          {event.description && <Typography variant="body2">{event.description}</Typography>}

          <TextField
            label="Poznámka do deníku"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={4}
            disabled={readOnly}
            placeholder={readOnly ? "Cvičenec zatím nic nezapsal." : "Jak trénink proběhl?"}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {!readOnly && hasNote && (
          <Button color="error" onClick={onDelete} disabled={loading} sx={{ mr: "auto" }}>
            Smazat
          </Button>
        )}
        <Button onClick={onClose} disabled={loading}>
          Zavřít
        </Button>
        {!readOnly && (
          <Button variant="contained" onClick={() => onSave(note)} disabled={loading || !note.trim()}>
            Uložit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
