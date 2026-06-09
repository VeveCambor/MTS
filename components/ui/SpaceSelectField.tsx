"use client";

import MenuItem from "@mui/material/MenuItem";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export type SelectOption = { value: string; label: string };

type SpaceSelectFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  options: SelectOption[];
} & Omit<TextFieldProps, "name" | "select" | "error" | "helperText" | "value" | "onChange">;

export function SpaceSelectField<T extends FieldValues>({
  name,
  control,
  options,
  ...textFieldProps
}: SpaceSelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...textFieldProps}
          {...field}
          select
          value={field.value ?? ""}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
