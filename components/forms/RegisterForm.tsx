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
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

export function RegisterForm() {
  const { signUp, loading, error } = useAuthActions();
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nick: "", email: "", firstName: "", lastName: "", password: "", passwordConfirm: "" },
  });

  return (
    <SpaceCard title="Registrace">
      <form
        onSubmit={handleSubmit((v) =>
          signUp({
            email: v.email,
            password: v.password,
            nick: v.nick,
            firstName: v.firstName,
            lastName: v.lastName,
          }),
        )}
        noValidate
      >
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <SpaceTextField control={control} name="nick" label="Přezdívka" autoFocus />
          <Stack direction="row" spacing={2}>
            <SpaceTextField control={control} name="firstName" label="Jméno" />
            <SpaceTextField control={control} name="lastName" label="Příjmení" />
          </Stack>
          <SpaceTextField control={control} name="email" label="E-mail" type="email" autoComplete="email" />
          <SpaceTextField
            control={control}
            name="password"
            label="Heslo"
            type="password"
            autoComplete="new-password"
          />
          <SpaceTextField
            control={control}
            name="passwordConfirm"
            label="Heslo znovu"
            type="password"
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Registruji…" : "Vytvořit účet"}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Už máš účet?{" "}
            <MuiLink component={Link} href="/login">
              Přihlas se
            </MuiLink>
          </Typography>
        </Stack>
      </form>
    </SpaceCard>
  );
}
