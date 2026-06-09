"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { SpaceConfirmDialog } from "@/components/ui/SpaceConfirmDialog";
import { useProfile } from "@/hooks/useProfile";
import { useTrainingPlans } from "@/hooks/useTrainingPlans";
import type { TrainingPlan } from "@/types/domain";

export function TemplatesList() {
  const { profile } = useProfile();
  const { data, isLoading, error, toggleEnabled, remove } = useTrainingPlans(profile?.id);
  const [deleting, setDeleting] = useState<TrainingPlan | null>(null);

  const columns: SpaceColumn<TrainingPlan>[] = [
    {
      key: "name",
      header: "Šablona",
      render: (r) => <strong>{r.name}</strong>,
    },
    {
      key: "cycles",
      header: "Struktura",
      render: (r) => `${r.number_of_cycles}× ${r.cycle_length} dní`,
    },
    {
      key: "enabled",
      header: "Aktivní",
      render: (r) => (
        <Switch
          checked={r.enabled}
          onChange={(_, checked) => toggleEnabled.mutate({ id: r.id, enabled: checked })}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Šablony plánů"
        subtitle="Tréninkové plány připravené k přiřazení cvičencům"
        action={
          <Button
            component={Link}
            href="/templates/training-plan/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nová šablona
          </Button>
        }
      />

      {error && <Alert severity="error">Šablony se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <SpaceTable
          columns={columns}
          rows={data ?? []}
          getRowId={(r) => r.id}
          emptyText="Zatím žádné šablony. Vytvoř první plán pomocí průvodce."
          renderActions={(row) => (
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
              <Tooltip title="Detail">
                <IconButton
                  size="small"
                  component={Link}
                  href={`/templates/training-plan/${row.id}`}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Smazat">
                <IconButton size="small" color="error" onClick={() => setDeleting(row)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        />
      )}

      <SpaceConfirmDialog
        open={Boolean(deleting)}
        title="Smazat šablonu"
        message={`Opravdu smazat šablonu „${deleting?.name}“?`}
        loading={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
