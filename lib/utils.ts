import { FieldErrors } from "react-hook-form";

export function getErrorMsg(formErrors: FieldErrors) {
  return (
    Object.entries(formErrors)
      .filter(([k]) => k !== "root")
      .map(([k, v]) =>
        v?.message ? `Error at '${k}': ${v.message}` : undefined,
      )
      .shift() || null
  );
}
