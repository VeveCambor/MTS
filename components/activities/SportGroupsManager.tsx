"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { RowActions } from "@/components/ui/RowActions";
import { SpaceConfirmDialog } from "@/components/ui/SpaceConfirmDialog";
import {
  NameDescriptionDialog,
  type NameDescriptionValues,
} from "@/components/forms/NameDescriptionDialog";
import { ActivityTrainingsPanel } from "./ActivityTrainingsPanel";
import { useActivityGroups } from "@/hooks/useActivityGroups";
import { useProfile } from "@/hooks/useProfile";
import type { ActivityGroup } from "@/types/domain";

type SportGroupsManagerProps = {
  activityId: string;
  activityName: string;
};

const columns: SpaceColumn<ActivityGroup>[] = [
  { key: "name", header: "Skupina", render: (r) => <strong>{r.name}</strong> },
  { key: "description", header: "Popis", render: (r) => r.description ?? "—" },
];

export function SportGroupsManager({ activityId, activityName }: SportGroupsManagerProps) {
  const { profile } = useProfile();
  const userId = profile?.id;
  const { data, isLoading, error, create, update, remove } = useActivityGroups(activityId, userId);

  const [editing, setEditing] = useState<ActivityGroup | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ActivityGroup | null>(null);

  const handleSubmit = (values: NameDescriptionValues) => {
    if (editing) {
      update.mutate(
        { id: editing.id, patch: { name: values.name, description: values.description || null } },
        { onSuccess: () => setEditing(null) },
      );
    } else if (userId) {
      create.mutate(
        {
          activity_id: activityId,
          user_id: userId,
          name: values.name,
          description: values.description || null,
        },
        { onSuccess: () => setCreating(false) },
      );
    }
  };

  return (
    <>
      <PageHeader
        title={activityName}
        subtitle="Skupiny tréninků a jejich jednotky"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreating(true)}>
            Nová skupina
          </Button>
        }
      />

      {error && <Alert severity="error">Skupiny se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <SpaceTable
          columns={columns}
          rows={data ?? []}
          getRowId={(r) => r.id}
          emptyText="Zatím žádné skupiny. Vytvoř první skupinu tréninků."
          renderActions={(row) => (
            <RowActions onEdit={() => setEditing(row)} onDelete={() => setDeleting(row)} />
          )}
          renderExpanded={(row) =>
            userId ? <ActivityTrainingsPanel groupId={row.id} userId={userId} /> : null
          }
        />
      )}

      <NameDescriptionDialog
        open={creating || Boolean(editing)}
        title={editing ? "Upravit skupinu" : "Nová skupina"}
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
        title="Smazat skupinu"
        message={`Opravdu smazat skupinu „${deleting?.name}“ včetně jejích jednotek?`}
        loading={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
