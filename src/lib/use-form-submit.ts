import { useState } from "react";
import { submitForm } from "@/api/submissions";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Shared submit handler for the site's public forms. Reads fields via
 * FormData (so inputs stay uncontrolled), posts to the single `submitForm`
 * server function, and tracks a simple status for the caller to render.
 */
export function useFormSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    buildPayload: (formData: FormData) => Record<string, unknown>,
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setError(null);

    try {
      const formData = new FormData(form);
      const payload = buildPayload(formData);
      await submitForm({ data: payload as never });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return { status, error, handleSubmit, reset: () => setStatus("idle") };
}
