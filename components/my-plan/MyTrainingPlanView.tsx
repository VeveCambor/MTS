"use client";

import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlanScheduleView } from "@/components/plans/PlanScheduleView";
import { useProfile } from "@/hooks/useProfile";
import { useAssignedPlans, useAssignedPlanComplete } from "@/hooks/useAssignedPlans";
import { exportElementToPdf } from "@/lib/utils/pdf";

export function MyTrainingPlanView() {
  const { profile } = useProfile();
  const { data: plans, isLoading } = useAssignedPlans(profile?.id);
  const [selectedId, setSelectedId] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // Efektivní výběr: ručně zvolený plán, jinak první v pořadí
  const planId = selectedId || plans?.[0]?.id || "";
  const { data: plan } = useAssignedPlanComplete(planId || undefined);

  const handleExport = async () => {
    if (!printRef.current || !plan) return;
    setExporting(true);
    try {
      await exportElementToPdf(printRef.current, plan.name);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  if (!plans || plans.length === 0) {
    return (
      <>
        <PageHeader title="Můj plán" />
        <Alert severity="info">Zatím ti nebyl přiřazen žádný tréninkový plán.</Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Můj plán"
        subtitle="Tréninkové plány přiřazené trenérem"
        action={
          plan && (
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Generuji…" : "Export PDF"}
            </Button>
          )
        }
      />

      <Stack sx={{ mb: 3, maxWidth: 360 }}>
        <TextField select label="Plán" value={planId} onChange={(e) => setSelectedId(e.target.value)}>
          {plans.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {plan && (
        <Box ref={printRef} sx={{ p: 1 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {plan.name}
          </Typography>
          <PlanScheduleView
            cycleLength={plan.cycle_length}
            numberOfCycles={plan.number_of_cycles}
            weeks={plan.weeks}
            activities={plan.activities}
          />
        </Box>
      )}
    </>
  );
}
