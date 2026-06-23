"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { useProfile } from "@/hooks/useProfile";
import { useTrainerInvites } from "@/hooks/useTrainerInvites";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { getTrainerInvitePreview, trainerDisplayName, translateInviteError } from "@/lib/services/invites";
import type { TrainerInvitePreview } from "@/types/domain";

type InviteAcceptViewProps = {
  code: string;
};

export function InviteAcceptView({ code }: InviteAcceptViewProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { profile, isTrainee, isLoading: profileLoading } = useProfile();
  const { accept } = useTrainerInvites();
  const [preview, setPreview] = useState<TrainerInvitePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPreviewLoading(true);
      try {
        const data = await getTrainerInvitePreview(supabase, code);
        if (!cancelled) setPreview(data);
      } catch {
        if (!cancelled) setPreview(null);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, code]);

  async function handleAccept() {
    setError(null);
    try {
      await accept.mutateAsync(code);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (e) {
      setError(translateInviteError(e instanceof Error ? e.message : "Pozvánku se nepodařilo přijmout."));
    }
  }

  if (profileLoading || previewLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 8 }} />;
  }

  const trainerName = preview ? trainerDisplayName(preview) : "Trenér";

  return (
    <>
      <PageHeader title="Pozvánka trenéra" />
      <SpaceCard glass sx={{ maxWidth: 560, mx: "auto" }}>
        <Stack spacing={2.5}>
          {!preview?.valid && (
            <Alert severity="error">Pozvánka neexistuje, vypršela nebo už byla použita.</Alert>
          )}

          {preview?.valid && !done && (
            <>
              <Typography variant="body1">
                <strong>{trainerName}</strong> tě zve jako sportovce v MyTrainingSpace.
              </Typography>
              {!isTrainee && (
                <Alert severity="warning">
                  Tento účet není cvičenec. Pozvánku lze přijmout pouze s účtem typu cvičenec.
                </Alert>
              )}
              {profile?.trainer_id && (
                <Alert severity="warning">Už máš přiřazeného trenéra. Nejdřív kontaktuj podporu.</Alert>
              )}
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  disabled={!isTrainee || Boolean(profile?.trainer_id) || accept.isPending}
                  onClick={handleAccept}
                >
                  {accept.isPending ? "Přijímám…" : "Přijmout pozvánku"}
                </Button>
                <Button variant="outlined" onClick={() => router.push("/dashboard")}>
                  Zpět
                </Button>
              </Stack>
            </>
          )}

          {done && (
            <Alert severity="success">Pozvánka přijata. Přesměrovávám na přehled…</Alert>
          )}
        </Stack>
      </SpaceCard>
    </>
  );
}
