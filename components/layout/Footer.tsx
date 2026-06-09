import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 4,
        textAlign: "center",
        bgcolor: "transparent",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} MTS s.r.o. · MyTrainingSpace
      </Typography>
    </Box>
  );
}
