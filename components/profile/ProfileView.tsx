"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import { SpaceSelectField } from "@/components/ui/SpaceSelectField";
import { useProfile } from "@/hooks/useProfile";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { updateProfile } from "@/lib/services/users";
import { queryKeys } from "@/lib/query-keys";
import { AVATAR_EMOJIS, avatarEmoji } from "@/lib/constants/avatars";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio: string;
  avatar: string;
};

export function ProfileView() {
  const { profile, isLoading } = useProfile();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    values: {
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      dateOfBirth: profile?.date_of_birth ?? "",
      bio: profile?.bio ?? "",
      avatar: profile?.avatar != null ? String(profile.avatar) : "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      updateProfile(supabase, profile!.id, {
        first_name: values.firstName || null,
        last_name: values.lastName || null,
        date_of_birth: values.dateOfBirth || null,
        bio: values.bio || null,
        avatar: values.avatar === "" ? null : Number(values.avatar),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      setSaved(true);
    },
  });

  if (isLoading || !profile) return <Skeleton variant="rounded" height={360} />;

  const avatarOptions = AVATAR_EMOJIS.map((emoji, i) => ({ value: String(i), label: emoji }));

  return (
    <>
      <PageHeader title="Profil" subtitle="Tvoje osobní údaje" />

      <SpaceCard sx={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar sx={{ width: 56, height: 56, fontSize: 28, bgcolor: "primary.main" }}>
                {avatarEmoji(profile.avatar)}
              </Avatar>
              <Stack>
                <TextField label="Přezdívka" value={profile.nick} disabled />
              </Stack>
            </Stack>
            <TextField label="E-mail" value={profile.email} disabled />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <SpaceTextField control={control} name="firstName" label="Jméno" />
              <SpaceTextField control={control} name="lastName" label="Příjmení" />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <SpaceTextField
                control={control}
                name="dateOfBirth"
                label="Datum narození"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <SpaceSelectField control={control} name="avatar" label="Avatar" options={avatarOptions} />
            </Stack>
            <SpaceTextField control={control} name="bio" label="O mně" multiline minRows={3} />

            {mutation.isError && <Alert severity="error">Profil se nepodařilo uložit.</Alert>}

            <Button type="submit" variant="contained" disabled={mutation.isPending} sx={{ alignSelf: "flex-start" }}>
              {mutation.isPending ? "Ukládám…" : "Uložit změny"}
            </Button>
          </Stack>
        </form>
      </SpaceCard>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Profil uložen"
      />
    </>
  );
}
