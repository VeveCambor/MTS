"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import PersonIcon from "@mui/icons-material/Person";
import SportsIcon from "@mui/icons-material/Sports";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import { SpacePasswordField } from "@/components/ui/SpacePasswordField";
import { useAuthActions } from "@/hooks/useAuthActions";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

export function RegisterForm() {
  const { signUp, loading, error } = useAuthActions();
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nick: "",
      email: "",
      firstName: "",
      lastName: "",
      accountType: "trainee",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <SpaceCard title="Registrace" glass sx={{ maxWidth: 600, mx: "auto" }}>
      <form
        onSubmit={handleSubmit((v) =>
          signUp({
            email: v.email,
            password: v.password,
            nick: v.nick,
            firstName: v.firstName,
            lastName: v.lastName,
            accountType: v.accountType,
          }),
        )}
        noValidate
      >
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <Controller
            name="accountType"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={Boolean(fieldState.error)} fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}>
                  Typ účtu
                </FormLabel>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={field.value}
                  onChange={(_, value) => value && field.onChange(value)}
                  aria-label="Typ účtu"
                >
                  <ToggleButton value="trainee">
                    <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                    Cvičenec
                  </ToggleButton>
                  <ToggleButton value="trainer">
                    <SportsIcon sx={{ mr: 1 }} fontSize="small" />
                    Trenér
                  </ToggleButton>
                </ToggleButtonGroup>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <SpaceTextField control={control} name="nick" label="Přezdívka" autoFocus />
          <Stack direction="row" spacing={2}>
            <SpaceTextField control={control} name="firstName" label="Jméno" />
            <SpaceTextField control={control} name="lastName" label="Příjmení" />
          </Stack>
          <SpaceTextField control={control} name="email" label="E-mail" type="email" autoComplete="email" />
          <SpacePasswordField
            control={control}
            name="password"
            label="Heslo"
            autoComplete="new-password"
          />
          <SpacePasswordField
            control={control}
            name="passwordConfirm"
            label="Heslo znovu"
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
