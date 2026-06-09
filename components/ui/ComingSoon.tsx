import Alert from "@mui/material/Alert";
import { PageHeader } from "./PageHeader";

type ComingSoonProps = {
  title: string;
  note?: string;
};

export function ComingSoon({ title, note }: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} />
      <Alert severity="info">{note ?? "Tato sekce se připravuje a bude doplněna v další fázi."}</Alert>
    </>
  );
}
