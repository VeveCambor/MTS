"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { trainerDisplayName, translateInviteError } from "@/lib/services/invites";
import type { TrainerInviteListItem } from "@/types/domain";

type IncomingInvitesBannerProps = {
  invites: TrainerInviteListItem[];
  loading?: boolean;
  onAccept: (code: string) => Promise<void>;
  onDecline: (inviteId: string) => Promise<void>;
};

export function IncomingInvitesBanner({
  invites,
  loading = false,
  onAccept,
  onDecline,
}: IncomingInvitesBannerProps) {
  const [actionError, setActionError] = useState<string | null>(null);

  if (!invites.length) return null;

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {invites.map((invite) => (
        <SpaceCard key={invite.id} glass>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>{trainerDisplayName(invite)}</strong> tě zve jako sportovce.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pozvánka pro e-mail {invite.email}. Po přijetí uvidíš tréninkové plány od tohoto trenéra.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={async () => {
                  setActionError(null);
                  try {
                    await onAccept(invite.code);
                  } catch (e) {
                    setActionError(
                      translateInviteError(e instanceof Error ? e.message : "Pozvánku se nepodařilo přijmout."),
                    );
                  }
                }}
              >
                Přijmout
              </Button>
              <Button
                variant="outlined"
                disabled={loading}
                onClick={async () => {
                  setActionError(null);
                  try {
                    await onDecline(invite.id);
                  } catch (e) {
                    setActionError(
                      translateInviteError(e instanceof Error ? e.message : "Pozvánku se nepodařilo odmítnout."),
                    );
                  }
                }}
              >
                Odmítnout
              </Button>
            </Stack>
          </Stack>
        </SpaceCard>
      ))}
    </Stack>
  );
}

type SentInvitesListProps = {
  invites: TrainerInviteListItem[];
  onCancel: (inviteId: string) => void;
  cancelling?: boolean;
};

export function SentInvitesList({ invites, onCancel, cancelling = false }: SentInvitesListProps) {
  if (!invites.length) return null;

  return (
    <SpaceCard title="Čekající pozvánky" sx={{ mt: 3 }}>
      <Stack spacing={1.5}>
        {invites.map((invite) => (
          <Stack
            key={invite.id}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
          >
            <Typography variant="body2">
              {invite.email} · kód <strong>{invite.code}</strong>
            </Typography>
            <Button
              size="small"
              color="inherit"
              disabled={cancelling}
              onClick={() => onCancel(invite.id)}
            >
              Zrušit
            </Button>
          </Stack>
        ))}
        <Alert severity="info" sx={{ mt: 1 }}>
          Sportovec musí mít účet se stejným e-mailem a pozvánku přijmout přes odkaz nebo na přehledu.
        </Alert>
      </Stack>
    </SpaceCard>
  );
}
