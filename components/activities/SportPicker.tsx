"use client";

import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceSportCard } from "@/components/ui/SpaceSportCard";
import { useActivities } from "@/hooks/useActivities";

type SportPickerProps = {
  title: string;
  subtitle: string;
  hrefBase: string;
};

export function SportPicker({ title, subtitle, hrefBase }: SportPickerProps) {
  const { data, isLoading, error } = useActivities();

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      {error && <Alert severity="error">Sporty se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4, mx: "auto", maxWidth: 200 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {(data ?? []).map((activity) => (
            <Grid key={activity.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <SpaceSportCard
                name={activity.name}
                description={activity.description}
                href={`${hrefBase}/${activity.id}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
