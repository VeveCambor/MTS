"use client";

import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { RowActions } from "@/components/ui/RowActions";
import { SpaceConfirmDialog } from "@/components/ui/SpaceConfirmDialog";
import {
  ParameterFormDialog,
  type ParameterFormValues,
} from "./ParameterFormDialog";
import { useTrainerParameters, useParameterTypes } from "@/hooks/useParameters";
import { useProfile } from "@/hooks/useProfile";
import type { TrainerParameter } from "@/types/domain";

type ParametersManagerProps = {
  activityId: string;
  activityName: string;
};

export function ParametersManager({ activityId, activityName }: ParametersManagerProps) {
  const { profile } = useProfile();
  const userId = profile?.id;
  const { data: types } = useParameterTypes();
  const { data, isLoading, error, create, update, remove } = useTrainerParameters(activityId, userId);

  const [editing, setEditing] = useState<TrainerParameter | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<TrainerParameter | null>(null);

  const typeOptions = useMemo(
    () => (types ?? []).map((t) => ({ value: t.id, label: t.name })),
    [types],
  );
  const typeName = (id: string) => types?.find((t) => t.id === id)?.name ?? "—";

  const columns: SpaceColumn<TrainerParameter>[] = [
    { key: "name", header: "Parametr", render: (r) => <strong>{r.name}</strong> },
    { key: "type", header: "Typ", render: (r) => <Chip size="small" label={typeName(r.parameter_type_id)} /> },
    { key: "description", header: "Popis", render: (r) => r.description ?? "—" },
  ];

  const handleSubmit = (values: ParameterFormValues) => {
    if (editing) {
      update.mutate(
        {
          id: editing.id,
          patch: {
            name: values.name,
            parameter_type_id: values.parameterTypeId,
            description: values.description || null,
          },
        },
        { onSuccess: () => setEditing(null) },
      );
    } else if (userId) {
      create.mutate(
        {
          user_id: userId,
          activity_id: activityId,
          parameter_type_id: values.parameterTypeId,
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
        title={`Parametry — ${activityName}`}
        subtitle="Měřitelné veličiny pro tréninkové jednotky"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreating(true)}>
            Nový parametr
          </Button>
        }
      />

      {error && <Alert severity="error">Parametry se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <SpaceTable
          columns={columns}
          rows={data ?? []}
          getRowId={(r) => r.id}
          emptyText="Zatím žádné parametry pro tento sport."
          renderActions={(row) => (
            <RowActions onEdit={() => setEditing(row)} onDelete={() => setDeleting(row)} />
          )}
        />
      )}

      <ParameterFormDialog
        open={creating || Boolean(editing)}
        title={editing ? "Upravit parametr" : "Nový parametr"}
        typeOptions={typeOptions}
        initialValues={
          editing
            ? {
                name: editing.name,
                parameterTypeId: editing.parameter_type_id,
                description: editing.description ?? "",
              }
            : undefined
        }
        loading={create.isPending || update.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />

      <SpaceConfirmDialog
        open={Boolean(deleting)}
        title="Smazat parametr"
        message={`Opravdu smazat parametr „${deleting?.name}“?`}
        loading={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
