"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { SpaceTable, type SpaceColumn } from "@/components/tables/SpaceTable";
import { useProfile } from "@/hooks/useProfile";
import { useActualParameters, useTrainerCatalog } from "@/hooks/useParameters";
import type { ActualUserParameter, TrainerParameter } from "@/types/domain";

export function MyProgressView() {
  const { profile } = useProfile();
  const { data: catalog } = useTrainerCatalog(profile?.trainer_id ?? undefined);
  const { data: values, isLoading } = useActualParameters(profile?.id);

  const paramName = (id: string) =>
    catalog?.find((p: TrainerParameter) => p.id === id)?.name ?? "Parametr";

  // Nejnovější hodnota pro každý parametr (values jsou řazené sestupně dle data)
  const latest = useMemo(() => {
    const map = new Map<string, ActualUserParameter>();
    for (const v of values ?? []) if (!map.has(v.trainer_parameter_id)) map.set(v.trainer_parameter_id, v);
    return [...map.values()];
  }, [values]);

  const columns: SpaceColumn<ActualUserParameter>[] = [
    { key: "param", header: "Parametr", render: (r) => <strong>{paramName(r.trainer_parameter_id)}</strong> },
    { key: "value", header: "Hodnota", render: (r) => r.value ?? "—" },
    {
      key: "recorded_at",
      header: "Zaznamenáno",
      render: (r) => format(new Date(r.recorded_at), "d. M. yyyy HH:mm"),
    },
  ];

  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  return (
    <>
      <PageHeader title="Pokrok" subtitle="Tvoje naměřené hodnoty parametrů" />

      {(!values || values.length === 0) && (
        <Alert severity="info">Zatím nemáš žádné zaznamenané hodnoty.</Alert>
      )}

      {latest.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {latest.map((v) => (
            <Grid key={v.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <SpaceCard>
                <Typography variant="body2" color="text.secondary">
                  {paramName(v.trainer_parameter_id)}
                </Typography>
                <Typography variant="h3">{v.value ?? "—"}</Typography>
              </SpaceCard>
            </Grid>
          ))}
        </Grid>
      )}

      {values && values.length > 0 && (
        <SpaceTable columns={columns} rows={values} getRowId={(r) => r.id} />
      )}
    </>
  );
}
