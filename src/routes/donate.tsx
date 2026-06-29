import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CreditCard, Building2, Heart } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Support CREAP Africa Initiative" },
      { name: "description", content: "Your gift powers civic education, climate action, oral health campaigns and youth empowerment across Nigeria and Africa." },
    ],
  }),
  component: Donate,
});

const AMOUNTS = ["₦5,000", "₦20,000", "₦50,000", "Custom"];

function Donate() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={<>Your gift builds <em className="italic text-goldf">resilient communities</em></>}
        body="Every contribution funds outreaches, research, capacity building and the everyday work of community transformation."
      />

      <section className="py-24 bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 grid lg:grid-cols-2 gap-12">
          <div className="bg-white border border-rule rounded-sm p-9 lg:p-12">
            <div className="w-14 h-14 grid place-items-center bg-g100 text-gold rounded-sm mb-6"><Heart size={26} /></div>
            <h2 className="display-md mb-4">Give Online</h2>
            <p className="text-ink3 mb-7">Choose an amount or enter your own — one-time or monthly.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you!"); }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {AMOUNTS.map((a) => (
                  <button key={a} type="button" className="border border-rule hover:border-gold hover:bg-goldb text-sm font-semibold py-3 rounded-sm transition">
                    {a}
                  </button>
                ))}
              </div>
              <input type="email" required placeholder="Email address" className="w-full border border-rule rounded-sm px-4 py-3 text-sm mb-3 focus:outline-none focus:border-gold transition" />
              <input type="text" required placeholder="Full name" className="w-full border border-rule rounded-sm px-4 py-3 text-sm mb-5 focus:outline-none focus:border-gold transition" />
              <button className="w-full bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold py-4 rounded-sm transition flex items-center justify-center gap-2">
                <CreditCard size={15} /> Donate Securely
              </button>
            </form>
          </div>

          <div className="bg-g700 text-white p-9 lg:p-12 rounded-sm">
            <div className="w-14 h-14 grid place-items-center bg-white/10 text-gold3 rounded-sm mb-6"><Building2 size={26} /></div>
            <h2 className="display-md text-white mb-4">Bank Transfer</h2>
            <p className="text-white/70 mb-8">Use the account details below — please email a confirmation so we can send you a receipt.</p>
            <dl className="space-y-5 text-sm">
              {[
                ["Account Name", "CREAP Africa Initiative"],
                ["Bank", "Access Bank Nigeria PLC"],
                ["Account Number", "0123456789"],
                ["Sort Code", "044150149"],
                ["Reference", "Your full name"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <dt className="text-white/55 tracking-wide uppercase text-[11px]">{k}</dt>
                  <dd className="font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-[12px] text-white/50">Send confirmation to <span className="text-gold3">finance@creapinitiative.org</span></p>
          </div>
        </div>
      </section>
    </>
  );
}
