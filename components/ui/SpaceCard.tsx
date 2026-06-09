import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { SxProps, Theme } from "@mui/material/styles";

type SpaceCardProps = {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
};

export function SpaceCard({ title, subheader, action, children, sx, contentSx }: SpaceCardProps) {
  return (
    <Card sx={sx}>
      {(title || action) && <CardHeader title={title} subheader={subheader} action={action} />}
      <CardContent sx={contentSx}>{children}</CardContent>
    </Card>
  );
}
