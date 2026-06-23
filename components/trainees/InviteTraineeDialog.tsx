"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import { getInviteUrl } from "@/lib/supabase/site-url";
import { translateInviteError } from "@/lib/services/invites";
import type { TrainerInvite } from "@/types/domain";

const schema = z.object({
  email: z.string().min(1, "Zadej e-mail").email("Neplatný e-mail"),
});

type FormValues = z.infer<typeof schema>;

type InviteTraineeDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<TrainerInvite>;
};

export function InviteTraineeDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: InviteTraineeDialogProps) {
  const [created, setCreated] = useState<TrainerInvite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const inviteUrl = created ? getInviteUrl(created.code) : "";

  function handleClose() {
    reset();
    setCreated(null);
    setError(null);
    setCopied(false);
    onClose();
  }

  async function submit(values: FormValues) {
    setError(null);
    try {
      const invite = await onSubmit(values.email);
      setCreated(invite);
    } catch (e) {
      setError(translateInviteError(e instanceof Error ? e.message : "Pozvánku se nepodařilo vytvořit."));
    }
  }

  async function copyLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {!created ? (
        <form onSubmit={handleSubmit(submit)} noValidate>
          <DialogTitle>Pozvat sportovce</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Zadej e-mail sportovce. Po registraci (stejný e-mail) může pozvánku přijmout — pošli mu
                odkaz nebo kód.
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <SpaceTextField
                control={control}
                name="email"
                label="E-mail sportovce"
                type="email"
                autoFocus
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Zrušit
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Vytvářím…" : "Vytvořit pozvánku"}
            </Button>
          </DialogActions>
        </form>
      ) : (
        <>
          <DialogTitle>Pozvánka vytvořena</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Alert severity="success">
                Pozvánka pro <strong>{created.email}</strong> je připravená. Pošli sportovci odkaz — po
                přihlášení (stejný e-mail) může pozvánku přijmout.
              </Alert>
              <TextField
                label="Odkaz pozvánky"
                value={inviteUrl}
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={copyLink} edge="end" aria-label="Kopírovat odkaz">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Kód pozvánky: <strong>{created.code}</strong> (platnost 14 dní)
              </Typography>
              {copied && (
                <Typography variant="caption" color="success.main">
                  Odkaz zkopírován do schránky.
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Hotovo
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
