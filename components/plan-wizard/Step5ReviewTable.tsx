"use client";

import { useRef, useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useActivities } from "@/hooks/useActivities";
import { dayDate, formatDayDate } from "@/lib/utils/plan";
import { exportElementToPdf } from "@/lib/utils/pdf";
import type { WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
  removeDay: (cycle: number, day: number) => void;
};

export function Step5ReviewTable({ state, removeDay }: Props) {
  const { data: activities } = useActivities();
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const sportName = (id: string | null) =>
    id ? (activities?.find((a) => a.id === id)?.name ?? "—") : "—";

  const rows = [...state.activities].sort(
    (a, b) => a.autonumCycle - b.autonumCycle || a.autonumInCycle - b.autonumInCycle,
  );

  const handleExport = async () => {
    if (!tableRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(tableRef.current, state.name || "treninkovy-plan");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h3">{state.name || "Tréninkový plán"}</Typography>
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Exportuji…" : "Export PDF"}
        </Button>
      </Stack>

      <TableContainer ref={tableRef}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Týden</TableCell>
              <TableCell>Den</TableCell>
              <TableCell>Aktivita</TableCell>
              <TableCell>Jednotka</TableCell>
              <TableCell align="right">Km</TableCell>
              <TableCell>Čas</TableCell>
              <TableCell align="right">Akce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={`${a.autonumCycle}-${a.autonumInCycle}`}>
                <TableCell>{a.autonumCycle}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {formatDayDate(dayDate(state, a.autonumCycle, a.autonumInCycle))}
                </TableCell>
                <TableCell>{sportName(a.activityId)}</TableCell>
                <TableCell>{a.name || "—"}</TableCell>
                <TableCell align="right">{a.km || "—"}</TableCell>
                <TableCell>{a.time || "—"}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => removeDay(a.autonumCycle, a.autonumInCycle)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
