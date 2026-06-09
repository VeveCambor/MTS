"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { RowActions } from "@/components/ui/RowActions";
import { TraineePlansPanel } from "./TraineePlansPanel";
import { EditTraineeDialog, type TraineeFormValues } from "./EditTraineeDialog";
import { useProfile } from "@/hooks/useProfile";
import { useTrainees } from "@/hooks/useTrainees";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { updateProfile } from "@/lib/services/users";
import { queryKeys } from "@/lib/query-keys";
import { roleLabel } from "@/lib/constants/roles";
import type { UserShort } from "@/types/domain";

function fullName(t: UserShort) {
  return [t.first_name, t.last_name].filter(Boolean).join(" ") || t.nick;
}

export function TraineesView() {
  const { profile } = useProfile();
  const trainerId = profile?.id;
  const { data, isLoading, error } = useTrainees(trainerId);
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<UserShort | null>(null);

  const editMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: TraineeFormValues }) =>
      updateProfile(supabase, id, {
        first_name: values.firstName || null,
        last_name: values.lastName || null,
      }),
    onSuccess: () => {
      if (trainerId) queryClient.invalidateQueries({ queryKey: queryKeys.trainees(trainerId) });
      setEditing(null);
    },
  });

  const columns: SpaceColumn<UserShort>[] = [
    { key: "name", header: "Cvičenec", render: (r) => <strong>{fullName(r)}</strong> },
    { key: "nick", header: "Přezdívka", render: (r) => r.nick },
    { key: "role", header: "Role", render: (r) => <Chip size="small" label={roleLabel(r.role)} /> },
  ];

  return (
    <>
      <PageHeader title="Sportovci" subtitle="Tvoji cvičenci a jejich tréninkové plány" />

      {error && <Alert severity="error">Sportovce se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <SpaceTable
          columns={columns}
          rows={data ?? []}
          getRowId={(r) => r.id}
          emptyText="Zatím nemáš žádné cvičence."
          renderActions={(row) => <RowActions onEdit={() => setEditing(row)} />}
          renderExpanded={(row) => <TraineePlansPanel traineeId={row.id} />}
        />
      )}

      <EditTraineeDialog
        open={Boolean(editing)}
        initialValues={{
          firstName: editing?.first_name ?? "",
          lastName: editing?.last_name ?? "",
        }}
        loading={editMutation.isPending}
        onSubmit={(values) => editing && editMutation.mutate({ id: editing.id, values })}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
