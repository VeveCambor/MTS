"use client";

import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { SportGroupsManager } from "./SportGroupsManager";
import { useActivities } from "@/hooks/useActivities";

export function SportDetail({ activityId }: { activityId: string }) {
  const { data, isLoading } = useActivities();

  if (isLoading) return <Skeleton variant="rounded" height={240} />;

  const activity = data?.find((a) => a.id === activityId);
  if (!activity) return <Alert severity="warning">Sport nebyl nalezen.</Alert>;

  return <SportGroupsManager activityId={activity.id} activityName={activity.name} />;
}
