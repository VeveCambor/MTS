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
  name: z.string().min(1, "Zadej název"),
  parameterTypeId: z.string().min(1, "Vyber typ parametru"),
  description: z.string().optional(),
});

export type ParameterFormValues = z.infer<typeof schema>;

type ParameterFormDialogProps = {
  open: boolean;
  title: string;
  typeOptions: SelectOption[];
  initialValues?: Partial<ParameterFormValues>;
  loading?: boolean;
  onSubmit: (values: ParameterFormValues) => void;
  onClose: () => void;
};

const EMPTY: ParameterFormValues = { name: "", parameterTypeId: "", description: "" };

export function ParameterFormDialog({
  open,
  title,
  typeOptions,
  initialValues,
  loading = false,
  onSubmit,
  onClose,
}: ParameterFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<ParameterFormValues>({
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
            <SpaceTextField control={control} name="name" label="Název parametru" autoFocus />
            <SpaceSelectField
              control={control}
              name="parameterTypeId"
              label="Typ parametru"
              options={typeOptions}
            />
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
