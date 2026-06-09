"use client";

import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { ParametersManager } from "./ParametersManager";
import { useActivities } from "@/hooks/useActivities";

export function ParametersActivityDetail({ activityId }: { activityId: string }) {
  const { data, isLoading } = useActivities();

  if (isLoading) return <Skeleton variant="rounded" height={240} />;

  const activity = data?.find((a) => a.id === activityId);
  if (!activity) return <Alert severity="warning">Sport nebyl nalezen.</Alert>;

  return <ParametersManager activityId={activity.id} activityName={activity.name} />;
}
