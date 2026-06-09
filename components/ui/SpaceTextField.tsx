"use client";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type SpaceTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & Omit<TextFieldProps, "name" | "error" | "helperText" | "value" | "onChange">;

export function SpaceTextField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: SpaceTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...textFieldProps}
          {...field}
          value={field.value ?? ""}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
