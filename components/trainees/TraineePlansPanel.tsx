"use client";

import { useState } from "react";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { RowActions } from "@/components/ui/RowActions";
import { SpaceConfirmDialog } from "@/components/ui/SpaceConfirmDialog";
import { AssignPlanDialog } from "./AssignPlanDialog";
import { useAssignedPlans } from "@/hooks/useAssignedPlans";
import { useTrainingPlans } from "@/hooks/useTrainingPlans";
import { useProfile } from "@/hooks/useProfile";
import type { TrainingPlanUserAssign } from "@/types/domain";

type TraineePlansPanelProps = {
  traineeId: string;
};

export function TraineePlansPanel({ traineeId }: TraineePlansPanelProps) {
  const { profile } = useProfile();
  const { data: templates } = useTrainingPlans(profile?.id);
  const { data, isLoading, toggleEnabled, remove, assignFromTemplate } = useAssignedPlans(traineeId);

  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState<TrainingPlanUserAssign | null>(null);

  const columns: SpaceColumn<TrainingPlanUserAssign>[] = [
    { key: "name", header: "Plán", render: (r) => <strong>{r.name}</strong> },
    {
      key: "start",
      header: "Začátek",
      render: (r) => format(new Date(r.date_time_start), "d. M. yyyy"),
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

  if (isLoading) {
    return (
      <Stack sx={{ alignItems: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Přiřazené plány
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setAssigning(true)}>
          Přiřadit plán
        </Button>
      </Stack>

      <SpaceTable
        columns={columns}
        rows={data ?? []}
        getRowId={(r) => r.id}
        emptyText="Cvičenec zatím nemá přiřazený žádný plán."
        renderActions={(row) => <RowActions onDelete={() => setDeleting(row)} />}
      />

      <AssignPlanDialog
        key={assigning ? "assign-open" : "assign-closed"}
        open={assigning}
        templates={templates ?? []}
        loading={assignFromTemplate.isPending}
        error={assignFromTemplate.isError ? "Plán se nepodařilo přiřadit." : null}
        onSubmit={(templateId, startDate) =>
          assignFromTemplate.mutate(
            { templateId, startDate },
            { onSuccess: () => setAssigning(false) },
          )
        }
        onClose={() => setAssigning(false)}
      />

      <SpaceConfirmDialog
        open={Boolean(deleting)}
        title="Smazat plán"
        message={`Opravdu smazat plán „${deleting?.name}“?`}
        loading={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
        onClose={() => setDeleting(null)}
      />
    </Stack>
  );
}
