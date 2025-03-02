import React from "react";
import { FieldErrors, FieldValues, get, Path } from "react-hook-form";
import { Label } from "../label";
import { FormError } from "../form-error";
import styles from "./input.module.css";

export interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | null;
  name: Path<T> | string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  error?: FieldErrors<T>;
}

export function Input<T extends FieldValues>({
  required,
  type,
  label,
  error,
  name,
  value,
  ...props
}: Props<T>) {
  return (
    <div className={styles.container}>
      <Label required={required} htmlFor={name} label={label ?? ""} />
      <input id={name} type={type} value={value} {...props} />
      <FormError error={get(error, name)} />
    </div>
  );
}
