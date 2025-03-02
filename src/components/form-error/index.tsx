import { JSX } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface FormErrorProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<never>>;
}

export const FormError = ({ error }: FormErrorProps): JSX.Element => {
  if (typeof error?.message !== "string") {
    return <></>;
  }

  return <span>{error.message}</span>;
};
