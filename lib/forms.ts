import { FieldErrors } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMsg } from "./utils";

export function toastError(errors: FieldErrors) {
  toast.error(getErrorMsg(errors));
}

// TODO: Enable dynamic form generation
