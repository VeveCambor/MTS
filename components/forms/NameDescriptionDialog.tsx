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

const schema = z.object({
  name: z.string().min(1, "Zadej název"),
  description: z.string().optional(),
});

export type NameDescriptionValues = z.infer<typeof schema>;

type NameDescriptionDialogProps = {
  open: boolean;
  title: string;
  initialValues?: Partial<NameDescriptionValues>;
  loading?: boolean;
  onSubmit: (values: NameDescriptionValues) => void;
  onClose: () => void;
};

const EMPTY: NameDescriptionValues = { name: "", description: "" };

export function NameDescriptionDialog({
  open,
  title,
  initialValues,
  loading = false,
  onSubmit,
  onClose,
}: NameDescriptionDialogProps) {
  const { control, handleSubmit, reset } = useForm<NameDescriptionValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset({ ...EMPTY, ...initialValues });
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <SpaceTextField control={control} name="name" label="Název" autoFocus />
            <SpaceTextField
              control={control}
              name="description"
              label="Popis"
              multiline
              minRows={2}
            />
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
