import { z } from "zod";

/**
 * One schema per CMS collection — the single source of truth for what a
 * dashboard entry form renders (see `fieldsFor` below) and what a create/
 * update call validates. Add a field here and it shows up in the dashboard
 * form automatically.
 */

export const policyBriefSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  date: z.string().min(1),
  image_url: z.string().url().optional().or(z.literal("")),
  file_url: z.string().url().optional().or(z.literal("")),
});

export const reportSchema = z.object({
  category: z.enum(["project", "annual", "financial"]),
  title: z.string().min(1),
  subtitle: z.string().optional().or(z.literal("")),
  body: z.string().min(1),
  date: z.string().min(1),
  file_url: z.string().url().optional().or(z.literal("")),
});

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.array(z.string().min(1)).min(1),
  image_url: z.string().url().optional().or(z.literal("")),
  author: z.string().min(1),
  date: z.string().min(1),
  read_minutes: z.string().min(1),
});

export const upcomingProgramSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  theme: z.string().min(1),
  summary: z.string().min(1),
  image_url: z.string().url().optional().or(z.literal("")),
  date: z.string().min(1),
  event_end_date: z.string().optional().or(z.literal("")),
  venue: z.string().min(1),
  audience: z.array(z.string().min(1)).default([]),
  skills: z.array(z.string().min(1)).default([]),
  apply_url: z.string().url().optional().or(z.literal("")),
  application_deadline: z.string().optional().or(z.literal("")),
  closing_note: z.string().optional().or(z.literal("")),
  partner_note: z.string().optional().or(z.literal("")),
  hashtags: z.array(z.string().min(1)).default([]),
});

export const galleryImageSchema = z.object({
  image_url: z.string().url(),
  caption: z.string().min(1),
  tall: z.boolean().default(false),
});

export const leadershipSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo_url: z.string().url().optional().or(z.literal("")),
  team: z.enum(["executive", "management"]),
});

export const toolkitGuideSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  file_url: z.string().url().optional().or(z.literal("")),
});

export const pressStatementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  date: z.string().min(1),
  file_url: z.string().url().optional().or(z.literal("")),
});

export type PolicyBrief = z.infer<typeof policyBriefSchema> & { id: string; sort_order: number };
export type Report = z.infer<typeof reportSchema> & { id: string; sort_order: number };
export type BlogPost = z.infer<typeof blogPostSchema> & { id: string; sort_order: number };
export type UpcomingProgramRow = z.infer<typeof upcomingProgramSchema> & { id: string; sort_order: number };
export type GalleryImage = z.infer<typeof galleryImageSchema> & { id: string; sort_order: number };
export type LeadershipEntry = z.infer<typeof leadershipSchema> & { id: string; sort_order: number };
export type ToolkitGuide = z.infer<typeof toolkitGuideSchema> & { id: string; sort_order: number };
export type PressStatement = z.infer<typeof pressStatementSchema> & { id: string; sort_order: number };
