"use client";

import Link from "next/link";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { PageHeader } from "@/components/ui/PageHeader";
import { useActivities } from "@/hooks/useActivities";

type SportPickerProps = {
  title: string;
  subtitle: string;
  hrefFor: (activityId: string) => string;
};

export function SportPicker({ title, subtitle, hrefFor }: SportPickerProps) {
  const { data, isLoading, error } = useActivities();

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      {error && <Alert severity="error">Sporty se nepodařilo načíst.</Alert>}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={96} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {(data ?? []).map((activity) => (
            <Grid key={activity.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardActionArea component={Link} href={`/templates/sport/${activity.id}`}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <FitnessCenterIcon color="primary" />
                      <div>
                        <Typography variant="h3">{activity.name}</Typography>
                        {activity.description && (
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        )}
                      </div>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
