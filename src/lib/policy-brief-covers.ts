import foodSecurity from "@/assets/Policy Brief/policy-brief-1.jpeg";
import peaceSecurity from "@/assets/Policy Brief/policy-brief-2.jpeg";
import dialogueToAction from "@/assets/Policy Brief/policy-brief-3.jpeg";
import africanYouth from "@/assets/Policy Brief/policy-brief-4.jpeg";

// Bundled covers, matched by title keyword. Used when a brief has no cover
// image set in the dashboard.
const COVERS: { match: RegExp; src: string }[] = [
  { match: /food security/i, src: foodSecurity },
  { match: /peace and security/i, src: peaceSecurity },
  { match: /dialogue to action|civic space/i, src: dialogueToAction },
  { match: /african youth/i, src: africanYouth },
];

export function policyBriefCover(title: string): string | undefined {
  return COVERS.find((c) => c.match.test(title))?.src;
}
