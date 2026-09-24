import { Briefcase, GraduationCap, Users2, HeartHandshake, MapPinned, type LucideIcon } from "lucide-react";
import type { Opportunity } from "@/api/collections";

/** Display label + icon per opportunity category, shared by the site and the dashboard. */
export const OPPORTUNITY_CATEGORY: Record<Opportunity["category"], { label: string; icon: LucideIcon }> = {
  "full-time": { label: "Full-time", icon: Briefcase },
  fellowship: { label: "Fellowship", icon: GraduationCap },
  internship: { label: "Internship", icon: Users2 },
  volunteer: { label: "Volunteer", icon: HeartHandshake },
  "state-coordinator": { label: "State Coordinator", icon: MapPinned },
};
