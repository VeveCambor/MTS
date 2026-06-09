"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { RowActions } from "@/components/ui/RowActions";
import { SpaceConfirmDialog } from "@/components/ui/SpaceConfirmDialog";
import {
  NameDescriptionDialog,
  type NameDescriptionValues,
} from "@/components/forms/NameDescriptionDialog";
import { useActivityTrainings } from "@/hooks/useActivityTrainings";
import type { ActivityTraining } from "@/types/domain";

type ActivityTrainingsPanelProps = {
  groupId: string;
  userId: string;
};

const columns: SpaceColumn<ActivityTraining>[] = [
  { key: "name", header: "Jednotka", render: (r) => <strong>{r.name}</strong> },
  { key: "description", header: "Popis", render: (r) => r.description ?? "—" },
];

export function ActivityTrainingsPanel({ groupId, userId }: ActivityTrainingsPanelProps) {
  const { data, isLoading, create, update, remove } = useActivityTrainings(groupId);
  const [editing, setEditing] = useState<ActivityTraining | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ActivityTraining | null>(null);

  const handleSubmit = (values: NameDescriptionValues) => {
    if (editing) {
      update.mutate(
        { id: editing.id, patch: { name: values.name, description: values.description || null } },
        { onSuccess: () => setEditing(null) },
      );
    } else {
      create.mutate(
        {
          activity_group_id: groupId,
          user_id: userId,
          name: values.name,
          description: values.description || null,
        },
        { onSuccess: () => setCreating(false) },
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Tréninkové jednotky
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setCreating(true)}>
          Přidat jednotku
        </Button>
      </Stack>

      <SpaceTable
        columns={columns}
        rows={data ?? []}
        getRowId={(r) => r.id}
        emptyText="Skupina zatím nemá žádné jednotky."
        renderActions={(row) => (
          <RowActions onEdit={() => setEditing(row)} onDelete={() => setDeleting(row)} />
        )}
      />

      <NameDescriptionDialog
        open={creating || Boolean(editing)}
        title={editing ? "Upravit jednotku" : "Nová jednotka"}
        initialValues={editing ? { name: editing.name, description: editing.description ?? "" } : undefined}
        loading={create.isPending || update.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />

      <SpaceConfirmDialog
        open={Boolean(deleting)}
        title="Smazat jednotku"
        message={`Opravdu smazat „${deleting?.name}“?`}
        loading={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
        onClose={() => setDeleting(null)}
      />
    </Stack>
  );
}
