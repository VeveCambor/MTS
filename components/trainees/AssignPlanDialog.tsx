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
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import type { TrainingPlan } from "@/types/domain";

type AssignPlanDialogProps = {
  open: boolean;
  templates: TrainingPlan[];
  loading?: boolean;
  error?: string | null;
  onSubmit: (templateId: string, startDate: string) => void;
  onClose: () => void;
};

export function AssignPlanDialog({
  open,
  templates,
  loading = false,
  error,
  onSubmit,
  onClose,
}: AssignPlanDialogProps) {
  const [templateId, setTemplateId] = useState("");
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const enabledTemplates = templates.filter((t) => t.enabled);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Přiřadit plán ze šablony</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            select
            label="Šablona"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {enabledTemplates.length === 0 ? (
              <MenuItem disabled value="">
                Nemáš žádné aktivní šablony
              </MenuItem>
            ) : (
              enabledTemplates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            type="date"
            label="Začátek plánu"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Zrušit
        </Button>
        <Button
          variant="contained"
          disabled={loading || !templateId}
          onClick={() => onSubmit(templateId, new Date(startDate).toISOString())}
        >
          {loading ? "Přiřazuji…" : "Přiřadit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
