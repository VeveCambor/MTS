"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import type { FieldPath, FieldValues } from "react-hook-form";
import { SpaceTextField } from "@/components/ui/SpaceTextField";
import type { ComponentProps } from "react";

type SpacePasswordFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: ComponentProps<typeof SpaceTextField<T>>["control"];
} & Omit<ComponentProps<typeof SpaceTextField<T>>, "name" | "control" | "type">;

export function SpacePasswordField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: SpacePasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <SpaceTextField
      name={name}
      control={control}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? "Skrýt heslo" : "Zobrazit heslo"}
                onClick={() => setVisible((v) => !v)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                size="small"
              >
                {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...textFieldProps}
    />
  );
}
