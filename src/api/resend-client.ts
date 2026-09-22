import { Resend } from "resend";

/** Constructed per-request inside handlers only — see start-core/execution-model. */
export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY.");
  }
  return new Resend(apiKey);
}

export function tryGetResend(): Resend | null {
  try {
    return getResend();
  } catch {
    return null;
  }
}
