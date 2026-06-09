"use client";

import Link from "next/link";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { useProfile } from "@/hooks/useProfile";
import { getNavSections } from "@/lib/constants/navigation";

export function DashboardView() {
  const { profile, role, isTrainer, isLoading, isError } = useProfile();

  if (isLoading) {
    return <Skeleton variant="rounded" height={200} />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Profil se nepodařilo načíst. Zkus obnovit stránku nebo se znovu přihlásit.
      </Alert>
    );
  }

  const name = profile?.first_name || profile?.nick || "";
  const quickLinks = getNavSections(role)
    .flatMap((s) => s.items)
    .filter((i) => i.href !== "/dashboard")
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title={`Vítej${name ? `, ${name}` : ""}!`}
        subtitle={
          isTrainer
            ? "Spravuj šablony, sportovce a jejich tréninkové plány."
            : "Sleduj svůj tréninkový plán a zaznamenávej pokrok."
        }
      />
      <Grid container spacing={2}>
        {quickLinks.map((link) => (
          <Grid key={link.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <SpaceCard title={link.label}>
              <Button component={Link} href={link.href} variant="outlined" startIcon={link.icon}>
                Otevřít
              </Button>
            </SpaceCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
