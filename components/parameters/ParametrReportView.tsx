"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { ActualValueDialog, type ActualValueFormValues } from "./ActualValueDialog";
import { useProfile } from "@/hooks/useProfile";
import { useTrainees } from "@/hooks/useTrainees";
import { useActualParameters, useAllMyParameters } from "@/hooks/useParameters";
import type { ActualUserParameter } from "@/types/domain";

function fullName(t: { first_name: string | null; last_name: string | null; nick: string }) {
  const name = [t.first_name, t.last_name].filter(Boolean).join(" ");
  return name || t.nick;
}

export function ParametrReportView() {
  const { profile } = useProfile();
  const trainerId = profile?.id;
  const { data: trainees, isLoading: traineesLoading } = useTrainees(trainerId);
  const { data: parameters } = useAllMyParameters(trainerId);

  const [traineeId, setTraineeId] = useState("");
  const [adding, setAdding] = useState(false);

  const { data: values, isLoading: valuesLoading, add } = useActualParameters(traineeId || undefined);

  const paramName = (id: string) => parameters?.find((p) => p.id === id)?.name ?? "—";
  const paramOptions = useMemo(
    () => (parameters ?? []).map((p) => ({ value: p.id, label: p.name })),
    [parameters],
  );

  const columns: SpaceColumn<ActualUserParameter>[] = [
    { key: "param", header: "Parametr", render: (r) => <strong>{paramName(r.trainer_parameter_id)}</strong> },
    { key: "value", header: "Hodnota", render: (r) => r.value ?? "—" },
    {
      key: "recorded_at",
      header: "Zaznamenáno",
      render: (r) => format(new Date(r.recorded_at), "d. M. yyyy HH:mm"),
    },
  ];

  const handleSubmit = (form: ActualValueFormValues) => {
    if (!trainerId || !traineeId) return;
    add.mutate(
      {
        user_id: traineeId,
        trainer_id: trainerId,
        trainer_parameter_id: form.parameterId,
        value: form.value,
      },
      { onSuccess: () => setAdding(false) },
    );
  };

  return (
    <>
      <PageHeader
        title="Hodnoty cvičenců"
        subtitle="Aktuální naměřené hodnoty parametrů"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!traineeId}
            onClick={() => setAdding(true)}
          >
            Zaznamenat hodnotu
          </Button>
        }
      />

      {traineesLoading ? (
        <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      ) : (
        <Stack sx={{ mb: 2, maxWidth: 360 }}>
          <TextField
            select
            label="Cvičenec"
            value={traineeId}
            onChange={(e) => setTraineeId(e.target.value)}
          >
            {(trainees ?? []).map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {fullName(t)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      {!traineeId ? (
        <Alert severity="info">Vyber cvičence pro zobrazení jeho hodnot.</Alert>
      ) : valuesLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <SpaceTable
          columns={columns}
          rows={values ?? []}
          getRowId={(r) => r.id}
          emptyText="Cvičenec zatím nemá žádné zaznamenané hodnoty."
        />
      )}

      <ActualValueDialog
        open={adding}
        parameterOptions={paramOptions}
        loading={add.isPending}
        onSubmit={handleSubmit}
        onClose={() => setAdding(false)}
      />
    </>
  );
}
