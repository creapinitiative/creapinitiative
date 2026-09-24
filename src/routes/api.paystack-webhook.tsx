import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/api/supabase-admin";
import { settleDonation, verifyWebhookSignature } from "@/api/paystack";

/**
 * Paystack webhook. Set its URL in the Paystack dashboard (Settings → API Keys
 * & Webhooks) to https://<your-domain>/api/paystack-webhook. This is what
 * records a gift even if the donor closes the tab before returning to the site.
 */
export const Route = createFileRoute("/api/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const valid = await verifyWebhookSignature(raw, request.headers.get("x-paystack-signature"));
        if (!valid) return new Response("Invalid signature", { status: 401 });

        try {
          const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };
          const reference = event.data?.reference;
          if (event.event === "charge.success" && reference) {
            await settleDonation(getSupabaseAdmin(), reference);
          }
        } catch (err) {
          console.error("Paystack webhook error:", err);
          // Non-2xx makes Paystack retry.
          return new Response("Error", { status: 500 });
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
