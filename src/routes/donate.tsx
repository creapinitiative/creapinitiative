import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Email } from "@/components/site/Email";
import { Reveal } from "@/components/site/Reveal";
import { useSuccessPopup } from "@/components/site/SuccessPopup";
import { startDonation, confirmDonation } from "@/api/paystack";
import { CreditCard, Building2, Heart, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/donate")({
  // Paystack sends the donor back with ?reference=…&trxref=…
  validateSearch: (search: Record<string, unknown>): { reference?: string } => ({
    reference: typeof search.reference === "string" ? search.reference : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donate — Support CREAP Africa Initiative" },
      { name: "description", content: "Your gift powers civic education, climate action, oral health campaigns and youth empowerment across Nigeria and Africa." },
    ],
  }),
  component: Donate,
});

const AMOUNTS = [5000, 20000, 50000];
const MIN_NAIRA = 100;

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function Donate() {
  const { reference } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { show } = useSuccessPopup();
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const confirmedRef = useRef<string | null>(null);

  // Returning from Paystack: confirm the payment server-side, then clean the URL.
  useEffect(() => {
    if (!reference || confirmedRef.current === reference) return;
    confirmedRef.current = reference;
    confirmDonation({ data: { reference } })
      .then((res) => {
        if (res.status === "success") {
          show(`Thank you, ${res.fullName.split(" ")[0]} — your gift of ${naira(res.amountKobo / 100)} was received.`);
        } else if (res.status === "pending") {
          setNotice("Your payment is still being processed. You'll get an email once it's confirmed.");
        } else {
          setError("Your payment wasn't completed, so you have not been charged. Please try again.");
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "We couldn't confirm your payment."))
      .finally(() => navigate({ to: "/donate", search: {}, replace: true }));
  }, [reference, navigate, show]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    const value = amount ?? Number(custom);
    if (!Number.isFinite(value) || value < MIN_NAIRA) {
      setError(`Please choose or enter an amount of at least ${naira(MIN_NAIRA)}.`);
      return;
    }
    setSubmitting(true);
    try {
      const { authorizationUrl } = await startDonation({
        data: { fullName: String(fd.get("fullName") ?? ""), email: String(fd.get("email") ?? ""), amountNaira: value },
      });
      window.location.href = authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={<>Your gift builds <em className="italic text-goldf">resilient communities</em></>}
        body="Every contribution funds outreaches, research, capacity building and the everyday work of community transformation."
      />

      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12 lg:px-28 grid lg:grid-cols-2 gap-12">
          <div className="bg-white border border-rule rounded-sm p-9 lg:p-12">
            <div className="w-14 h-14 grid place-items-center bg-g100 text-gold rounded-sm mb-6"><Heart size={26} /></div>
            <h2 className="display-md mb-4">Give Online</h2>
            <p className="text-ink3 mb-7">Choose an amount or enter your own.</p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a);
                      setCustom("");
                    }}
                    className={[
                      "border hover:border-gold hover:bg-goldb text-sm font-semibold py-3 rounded-sm transition",
                      amount === a ? "border-gold bg-goldb" : "border-rule",
                    ].join(" ")}
                  >
                    {naira(a)}
                  </button>
                ))}
              </div>
              <div className="relative mb-5">
                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-ink3">₦</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_NAIRA}
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setAmount(null);
                  }}
                  placeholder="Enter custom amount"
                  aria-label="Custom amount in naira"
                  className={[
                    "w-full border rounded-sm pl-9 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-gold transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                    custom ? "border-gold bg-goldb" : "border-rule",
                  ].join(" ")}
                />
              </div>
              <input name="email" type="email" required placeholder="Email address" className="w-full border border-rule rounded-sm px-4 py-3 text-sm mb-3 focus:outline-none focus:border-gold transition" />
              <input name="fullName" type="text" required placeholder="Full name" className="w-full border border-rule rounded-sm px-4 py-3 text-sm mb-5 focus:outline-none focus:border-gold transition" />
              <button
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold2 disabled:opacity-60 text-g900 uppercase tracking-wider text-xs font-semibold py-4 rounded-sm transition flex items-center justify-center gap-2"
              >
                <CreditCard size={15} /> {submitting ? "Redirecting to Paystack…" : "Donate Securely"}
              </button>
              <p className="mt-3 text-[12px] text-ink4 text-center">Payments are processed securely by Paystack.</p>
              {error && (
                <p className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </p>
              )}
              {notice && <p className="mt-4 text-sm text-ink3">{notice}</p>}
            </form>
          </div>

          <div className="bg-g700 text-white p-9 lg:p-12 rounded-sm">
            <div className="w-14 h-14 grid place-items-center bg-white/10 text-gold3 rounded-sm mb-6"><Building2 size={26} /></div>
            <h2 className="display-md text-white mb-4">Bank Transfer</h2>
            <p className="text-white/70 mb-8">Use the account details below — please email a confirmation so we can send you a receipt.</p>
            <dl className="space-y-5 text-sm">
              {[
                ["Account Name", "Community Rights Education Advancement Pathway Initiative"],
                ["Bank", "Stanbic IBTC Plc"],
                ["Account Number (NGN)", "0075692453"],
                ["Account Number (USD)", "0075692477"],
                ["Reference", "Your full name"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <dt className="text-white/55 tracking-wide uppercase text-[11px]">{k}</dt>
                  <dd className="font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-[12px] text-white/50">Send confirmation to <Email address="finance@creapinitiative.org" className="text-gold3" /></p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
