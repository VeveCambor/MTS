"use client";

import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowRight";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { glassShimmerSx, motion, neonGlow, radius, shellTokens } from "@/styles/tokens";

export type SpaceColumn<T> = {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
};

type SpaceTableProps<T> = {
  columns: SpaceColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  renderActions?: (row: T) => React.ReactNode;
  renderExpanded?: (row: T) => React.ReactNode;
  emptyText?: string;
};

export function SpaceTable<T>({
  columns,
  rows,
  getRowId,
  renderActions,
  renderExpanded,
  emptyText = "Žádné záznamy.",
}: SpaceTableProps<T>) {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandable = Boolean(renderExpanded);
  const colSpan = columns.length + (expandable ? 1 : 0) + (renderActions ? 1 : 0);

  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        borderRadius: radius.lg,
        overflow: "hidden",
        p: { xs: 1.5, md: 2 },
        background: tokens.glassCard,
        backdropFilter: "blur(12px) saturate(140%)",
        borderColor: tokens.glassBorderOuter,
        boxShadow: tokens.shadows.sm,
        transition: `box-shadow ${motion.normal}`,
        ...glassShimmerSx(mode),
        "&:hover": { boxShadow: `${tokens.shadows.md}, ${neonGlow(mode, "soft")}` },
      }}
    >
      <TableContainer sx={{ borderRadius: radius.md, overflow: "hidden" }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {expandable && <TableCell sx={{ width: 48, pl: 1.5 }} />}
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} sx={{ width: col.width, fontWeight: 600 }}>
                  {col.header}
                </TableCell>
              ))}
              {renderActions && <TableCell align="right" sx={{ width: 120, pr: 1.5 }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    {emptyText}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {rows.map((row) => {
              const id = getRowId(row);
              const isOpen = expandedId === id;
              return (
                <Fragment key={id}>
                  <TableRow hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    {expandable && (
                      <TableCell sx={{ pl: 1.5 }}>
                        <IconButton size="small" onClick={() => setExpandedId(isOpen ? null : id)}>
                          {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key} align={col.align}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </TableCell>
                    ))}
                    {renderActions && (
                      <TableCell align="right" sx={{ pr: 1.5 }}>
                        {renderActions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                  {expandable && (
                    <TableRow>
                      <TableCell colSpan={colSpan} sx={{ py: 0, border: 0 }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, pl: 5, pr: 2 }}>{renderExpanded!(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
