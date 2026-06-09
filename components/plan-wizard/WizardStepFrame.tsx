import Box from "@mui/material/Box";

const WIDTH = {
  narrow: 520,
  wide: 720,
} as const;

type WizardStepFrameProps = {
  children: React.ReactNode;
  width?: keyof typeof WIDTH | "full";
};

/** Vycentrovaný obsah kroku wizardu. */
export function WizardStepFrame({ children, width = "narrow" }: WizardStepFrameProps) {
  if (width === "full") {
    return <Box sx={{ width: "100%" }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: WIDTH[width] }}>{children}</Box>
    </Box>
  );
}

export function wizardNavSx(width: keyof typeof WIDTH | "full" = "narrow") {
  if (width === "full") return { width: "100%" };
  return { maxWidth: WIDTH[width], mx: "auto", width: "100%" };
}
