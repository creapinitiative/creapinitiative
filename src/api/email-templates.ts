type FormType = "contact" | "coordinator" | "donate_interest" | "newsletter";

function wrapper(bodyHtml: string): string {
  return `
    <div style="background:#f6f8f6;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e5e8e5;">
        <div style="background:#0a1a0f;padding:24px 32px;">
          <span style="color:#e8c547;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;">CREAP Africa Initiative</span>
        </div>
        <div style="padding:32px;color:#2b2b2b;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </div>
        <div style="padding:20px 32px;background:#f6f8f6;color:#8a8a8a;font-size:12px;">
          Abuja, Nigeria &middot; contact@creapinitiative.org
        </div>
      </div>
    </div>
  `;
}

const FORM_LABELS: Record<FormType, string> = {
  contact: "Contact form",
  coordinator: "State Coordinator application",
  donate_interest: "Donation interest",
  newsletter: "Newsletter sign-up",
};

/** Email sent back to whoever filled out the form. */
export function confirmationEmail(formType: FormType, data: Record<string, unknown>): { subject: string; html: string } {
  const name = (data.fullName as string) || (data.name as string) || (data.firstName as string) || "there";

  const messages: Record<FormType, string> = {
    contact: "Thank you for reaching out — a member of our team will respond to your message shortly.",
    coordinator: "Thank you for applying to become a State Coordinator. Our team will review your application and be in touch.",
    donate_interest: "Thank you for your interest in supporting CREAP Africa Initiative — we'll follow up with next steps shortly.",
    newsletter: "You're subscribed to Community Pulse, our monthly newsletter. Welcome aboard!",
  };

  return {
    subject: `We received your ${FORM_LABELS[formType].toLowerCase()}`,
    html: wrapper(`
      <p>Hi ${name},</p>
      <p>${messages[formType]}</p>
      <p style="margin-top:24px;">— The CREAP Africa Initiative team</p>
    `),
  };
}

/** Internal notification sent to the admin inbox for every submission. */
export function notificationEmail(formType: FormType, data: Record<string, unknown>): { subject: string; html: string } {
  const rows = Object.entries(data)
    .map(([key, value]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#8a8a8a;vertical-align:top;white-space:nowrap;">${key}</td>
        <td style="padding:6px 0;color:#2b2b2b;">${String(value ?? "")}</td>
      </tr>
    `)
    .join("");

  return {
    subject: `New ${FORM_LABELS[formType]}`,
    html: wrapper(`
      <p style="margin-bottom:16px;">A new <strong>${FORM_LABELS[formType]}</strong> was submitted on the website:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
    `),
  };
}
