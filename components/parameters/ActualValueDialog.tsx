"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import { SpaceSelectField, type SelectOption } from "@/components/ui/SpaceSelectField";

const schema = z.object({
  parameterId: z.string().min(1, "Vyber parametr"),
  value: z.string().min(1, "Zadej hodnotu"),
});

export type ActualValueFormValues = z.infer<typeof schema>;

type ActualValueDialogProps = {
  open: boolean;
  parameterOptions: SelectOption[];
  loading?: boolean;
  onSubmit: (values: ActualValueFormValues) => void;
  onClose: () => void;
};

const EMPTY: ActualValueFormValues = { parameterId: "", value: "" };

export function ActualValueDialog({
  open,
  parameterOptions,
  loading = false,
  onSubmit,
  onClose,
}: ActualValueDialogProps) {
  const { control, handleSubmit, reset } = useForm<ActualValueFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(EMPTY);
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Zaznamenat hodnotu</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <SpaceSelectField
              control={control}
              name="parameterId"
              label="Parametr"
              options={parameterOptions}
            />
            <SpaceTextField control={control} name="value" label="Hodnota" />
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
