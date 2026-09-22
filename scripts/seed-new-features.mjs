// One-time, ADDITIVE-ONLY seed for the newer dashboard features. Unlike
// seed-supabase.mjs, this script never deletes existing rows — it only
// updates the one existing upcoming-program row (to backfill its new
// event_end_date) and inserts dummy content into brand-new tables, so it's
// safe to run even after real admin edits exist in the database.
//
// Usage:
//   node --env-file=.env scripts/seed-new-features.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

// ── Backfill event_end_date on the existing seeded program ─────────────
// Its display date ("26-28 August 2026") already reads as a past event
// relative to today, so this alone demonstrates the "Past" tag + archive
// section without needing a fabricated example.
{
  const { error } = await supabase
    .from("upcoming_programs")
    .update({ event_end_date: "2026-08-28" })
    .eq("slug", "safe-civic-engagement-workshop-abuja-aug-2026");
  if (error) throw new Error(`upcoming_programs backfill: ${error.message}`);
  console.log("Backfilled event_end_date on the existing upcoming program.");
}

// ── One dummy *upcoming* program, so the Upcoming section isn't empty ───
{
  const slug = "community-digital-literacy-bootcamp-nov-2026";
  const { data: existing } = await supabase.from("upcoming_programs").select("id").eq("slug", slug).maybeSingle();
  if (!existing) {
    const { error } = await supabase.from("upcoming_programs").insert({
      slug,
      title: "CALL FOR APPLICATIONS!",
      subtitle: "Community Digital Literacy Bootcamp",
      theme: "Bridging the Digital Divide: Practical Digital Skills for Everyday Community Life",
      image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
      summary: "A hands-on bootcamp equipping community members with practical digital skills for work, civic participation, and everyday life.",
      audience: ["Community Members", "Small Business Owners", "Youth Groups", "Local Government Staff"],
      date: "18-19 November 2026",
      event_end_date: "2026-11-19",
      venue: "Uyo, Akwa Ibom State",
      skills: ["Basic Digital Tools", "Online Safety", "Digital Financial Literacy", "Accessing Public Services Online"],
      apply_url: "https://bit.ly/digital-literacy-bootcamp",
      application_deadline: "Friday 6th November 2026",
      closing_note: "Closing the digital divide starts with the skills we build together.",
      partner_note: null,
      hashtags: ["DigitalLiteracy", "CommunityTech", "BridgingTheDivide"],
      sort_order: 1,
    });
    if (error) throw new Error(`upcoming_programs insert: ${error.message}`);
    console.log("Inserted 1 dummy upcoming program.");
  } else {
    console.log("Dummy upcoming program already exists, skipped.");
  }
}

async function seedIfEmpty(table, rows) {
  const { count, error: countError } = await supabase.from(table).select("id", { count: "exact", head: true });
  if (countError) throw new Error(`${table} count: ${countError.message}`);
  if (count && count > 0) {
    console.log(`${table} already has ${count} row(s), skipped.`);
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table} insert: ${error.message}`);
  console.log(`Seeded ${rows.length} row(s) into ${table}`);
}

// ── Toolkits & Guides (dummy content) ────────────────────────────────────
await seedIfEmpty("toolkits_guides", [
  {
    title: "Community Advocacy Toolkit",
    date: "July 2026",
    description: "A step-by-step toolkit for community leaders running local advocacy campaigns — from framing an issue to engaging decision-makers.",
    file_url: null,
    sort_order: 0,
  },
  {
    title: "Civic Education Facilitator's Guide",
    date: "April 2026",
    description: "A practical guide for facilitators delivering CREAP's civic education workshops in schools and community settings.",
    file_url: null,
    sort_order: 1,
  },
  {
    title: "Digital Safety Handbook for Activists",
    date: "January 2026",
    description: "Practical guidance on protecting personal data, secure communication, and staying safe online while doing advocacy work.",
    file_url: null,
    sort_order: 2,
  },
]);

// ── Press Statements (dummy content) ─────────────────────────────────────
await seedIfEmpty("press_statements", [
  {
    title: "CREAP Africa Initiative Statement on the 2026 National Civic Space Report",
    date: "March 2026",
    body: "CREAP Africa Initiative welcomes the findings of the 2026 National Civic Space Report and reaffirms its commitment to protecting the rights of civil society actors across Nigeria.",
    file_url: null,
    sort_order: 0,
  },
  {
    title: "Statement on the Conclusion of the 16 Days of Activism Campaign",
    date: "December 2025",
    body: "As the 2025 16 Days of Activism campaign concludes, CREAP Africa Initiative reflects on the strong community partnerships built this year and renews its call for sustained action against gender-based violence.",
    file_url: null,
    sort_order: 1,
  },
  {
    title: "Press Statement: CREAP Partners with State Government on Youth Digital Skills Initiative",
    date: "August 2024",
    body: "CREAP Africa Initiative is pleased to announce a new partnership with the Niger State Government to expand access to digital skills training for young people across the state.",
    file_url: null,
    sort_order: 2,
  },
]);

console.log("\nDone — new features are seeded with dummy content.");
