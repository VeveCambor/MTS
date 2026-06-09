"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import { useAuthActions } from "@/hooks/useAuthActions";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

export function LoginForm() {
  const { signIn, loading, error } = useAuthActions();
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <SpaceCard title="Přihlášení">
      <form onSubmit={handleSubmit((v) => signIn(v.email, v.password))} noValidate>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <SpaceTextField control={control} name="email" label="E-mail" type="email" autoComplete="email" autoFocus />
          <SpaceTextField
            control={control}
            name="password"
            label="Heslo"
            type="password"
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Přihlašuji…" : "Přihlásit se"}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Nemáš účet?{" "}
            <MuiLink component={Link} href="/register">
              Zaregistruj se
            </MuiLink>
          </Typography>
        </Stack>
      </form>
    </SpaceCard>
  );
}
