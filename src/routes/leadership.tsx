import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";

import sylvanusUdoenoh from "@/assets/leadership/sylvanus-udoenoh.jpg";
import marvinJoseph from "@/assets/leadership/marvin-joseph.jpg";
import mondayPeter from "@/assets/leadership/monday-peter.jpg";
import abdullahiSani from "@/assets/leadership/abdullahi-sani.jpg";
import danielOloge from "@/assets/leadership/daniel-ologe.jpg";
import gloriaUkeKehinde from "@/assets/leadership/gloria-uke-kehinde.jpg";
import kayodeOlonidu from "@/assets/leadership/kayode-olonidu.jpg";
import shafaatuAliyu from "@/assets/leadership/shafaatu-aliyu.jpg";
import victorJacob from "@/assets/leadership/victor-jacob.jpg";
import samuelBrown from "@/assets/leadership/samuel-brown.jpg";
import aliyuBAli from "@/assets/leadership/aliyu-b-ali.jpg";
import camilusEkujere from "@/assets/leadership/camilus-ekujere.jpg";
import khadijahMuhammad from "@/assets/leadership/khadijah-muhammad.jpg";
import samuelEteudo from "@/assets/leadership/samuel-eteudo.jpg";
import julietNkwaeze from "@/assets/leadership/juliet-nkwaeze.jpg";
import martinIbrahim from "@/assets/leadership/martin-ibrahim.jpg";
import ahmedBabi from "@/assets/leadership/ahmed-babi.jpg";
import mercyAniekanUdom from "@/assets/leadership/mercy-aniekan-udom.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — CREAP Africa Initiative" },
      { name: "description", content: "Meet the executive leadership, management team and state coordinators driving CREAP Africa Initiative." },
    ],
  }),
  component: Leadership,
});

type Member = { name: string; role: string; photo?: string };

const EXECUTIVE: Member[] = [
  { name: "Sylvanus Udoenoh", role: "Founder & Executive Director", photo: sylvanusUdoenoh },
  { name: "Marvin O. Joseph", role: "Director of Programs", photo: marvinJoseph },
  { name: "Monday Peter", role: "Director of Finance", photo: mondayPeter },
  { name: "Abdullahi Sani", role: "Operations Manager", photo: abdullahiSani },
];

const MANAGEMENT: Member[] = [
  { name: "Pastor Daniel Ologe", role: "MEAL Specialist", photo: danielOloge },
  { name: "Gloria Uke Kehinde", role: "Community Engagement Specialist", photo: gloriaUkeKehinde },
  { name: "Kayode Olonidu", role: "Legal & Research Specialist", photo: kayodeOlonidu },
  { name: "Shafaátu Aliyu", role: "Administrative & Liaison Officer", photo: shafaatuAliyu },
  { name: "Victor Jacob", role: "Procurement Specialist", photo: victorJacob },
  { name: "Samuel Brown", role: "Communications & Media Officer", photo: samuelBrown },
  { name: "Ibrahim Mustapha", role: "Data Analyst" },
  { name: "Aliyu B. Ali, PhD", role: "Public Policy Specialist", photo: aliyuBAli },
  { name: "Camilus Ekujere", role: "Community Development Specialist", photo: camilusEkujere },
  { name: "Victoria Robson", role: "Project Coordinator" },
];

const STATE_TEAM: Member[] = [
  { name: "Khadijah Muhammad", role: "Niger State (Programs Lead)", photo: khadijahMuhammad },
  { name: "Samuel Eteudo", role: "Akwa Ibom State (Programs Lead)", photo: samuelEteudo },
  { name: "Juliet Nkwaeze", role: "Sokoto State (Programs Lead)", photo: julietNkwaeze },
  { name: "Martin Ibrahim", role: "Plateau State (Programs Lead)", photo: martinIbrahim },
  { name: "Ahmed Babi", role: "Yobe State (Programs Lead)", photo: ahmedBabi },
  { name: "Anas Abubakar", role: "Sokoto (Community Engagement Manager)" },
  { name: "Mercy Aniekan Udom", role: "Community Engagement Officer, Akwa Ibom State", photo: mercyAniekanUdom },
];

function Card({ name, role, photo }: Member) {
  return (
    <article className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold transition">
      <div className="aspect-[4/5] bg-gradient-to-br from-g100 to-g50 grid place-items-center overflow-hidden">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="font-display text-7xl text-g300 group-hover:text-gold transition">
            {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl">{name}</h3>
        <p className="text-[12px] tracking-[0.16em] uppercase text-gold font-semibold mt-1.5">{role}</p>
      </div>
    </article>
  );
}

function Leadership() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title={<>The people behind <em className="italic text-goldf">CREAP</em></>}
        body="An executive team, management specialists and state coordinators united by community, rights and sustainable development."
      />

      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Executive Leadership</p>
          <h2 className="display-lg mb-12">Governance & <em className="text-gold italic">stewardship</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXECUTIVE.map((m, idx) => (
              <RevealItem key={m.name} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-24 bg-g50 border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Management Team</p>
          <h2 className="display-lg mb-12">Day-to-day <em className="text-gold italic">leadership</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MANAGEMENT.map((m, idx) => (
              <RevealItem key={m.name} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-24 bg-bg border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">State Level Team</p>
          <h2 className="display-lg mb-12">Leading our work <em className="text-gold italic">on the ground</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATE_TEAM.map((m, idx) => (
              <RevealItem key={m.name} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-g700 text-white py-20">
        <Reveal as="div" className="mx-auto max-w-[1100px] px-5 sm:px-8 md:px-12 lg:px-28 text-center">
          <p className="eyebrow mb-4">Join Us</p>
          <h2 className="display-md text-white mb-5">
            Become a <em className="italic text-goldf">State Coordinator</em>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Help lead our work in your state — coordinating outreaches, partnerships and research engagement on the ground.
          </p>
          <Link to="/get-involved" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-8 py-4 rounded-sm transition">
            Apply Now
          </Link>
        </Reveal>
      </section>
    </>
  );
}
