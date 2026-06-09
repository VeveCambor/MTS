import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", color: "primary.main" }}>
            MyTrainingSpace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plánování tréninků
          </Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
