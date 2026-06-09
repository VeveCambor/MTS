"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { SpaceTextField } from "@/components/ui/SpaceTextField";

export type TraineeFormValues = {
  firstName: string;
  lastName: string;
};

type EditTraineeDialogProps = {
  open: boolean;
  initialValues: TraineeFormValues;
  loading?: boolean;
  onSubmit: (values: TraineeFormValues) => void;
  onClose: () => void;
};

export function EditTraineeDialog({
  open,
  initialValues,
  loading = false,
  onSubmit,
  onClose,
}: EditTraineeDialogProps) {
  const { control, handleSubmit, reset } = useForm<TraineeFormValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) reset(initialValues);
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Upravit cvičence</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <SpaceTextField control={control} name="firstName" label="Jméno" autoFocus />
            <SpaceTextField control={control} name="lastName" label="Příjmení" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Zrušit
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Uložit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
