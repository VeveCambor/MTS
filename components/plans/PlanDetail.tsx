"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlanScheduleView } from "./PlanScheduleView";
import { usePlanComplete } from "@/hooks/useTrainingPlans";
import { exportElementToPdf } from "@/lib/utils/pdf";

export function PlanDetail({ planId }: { planId: string }) {
  const { data, isLoading, error } = usePlanComplete(planId);
  const printRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!printRef.current || !data) return;
    setExporting(true);
    try {
      await exportElementToPdf(printRef.current, data.name);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) return <Skeleton variant="rounded" height={300} />;
  if (error || !data) return <Alert severity="error">Plán se nepodařilo načíst.</Alert>;

  return (
    <>
      <PageHeader
        title={data.name}
        subtitle={data.description ?? undefined}
        action={
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Generuji…" : "Export PDF"}
          </Button>
        }
      />

      <Box ref={printRef} sx={{ p: 1 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {data.name}
        </Typography>
        <PlanScheduleView
          cycleLength={data.cycle_length}
          numberOfCycles={data.number_of_cycles}
          weeks={data.weeks}
          activities={data.activities}
        />
      </Box>
    </>
  );
}
