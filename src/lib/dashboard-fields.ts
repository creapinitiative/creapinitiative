/**
 * One config per CMS collection, driving the dashboard's auto-generated
 * entry form (a la Sveltia/Decap CMS's `fields:` config) — add or change a
 * field here and the create/edit form updates everywhere.
 */
export type FieldConfig =
  | { key: string; label: string; type: "text"; required?: boolean; helper?: string }
  | { key: string; label: string; type: "textarea"; required?: boolean; helper?: string }
  | { key: string; label: string; type: "url"; required?: boolean; helper?: string }
  | { key: string; label: string; type: "image"; required?: boolean; helper?: string }
  | { key: string; label: string; type: "date"; required?: boolean; helper?: string }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean }
  | { key: string; label: string; type: "list"; helper?: string };

export const policyBriefFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "date", label: "Date", type: "text", required: true },
  { key: "body", label: "Summary", type: "textarea", required: true },
  { key: "image_url", label: "Cover image", type: "image" },
  { key: "file_url", label: "PDF link", type: "url", helper: "Paste a Google Drive share link or any public URL." },
];

export const reportFields: FieldConfig[] = [
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { value: "project", label: "Project Report" },
      { value: "annual", label: "Annual Report" },
      { value: "financial", label: "Financial Report" },
    ],
  },
  { key: "title", label: "Title", type: "text", required: true },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "date", label: "Date", type: "text", required: true },
  { key: "body", label: "Summary", type: "textarea", required: true },
  { key: "image_url", label: "Cover image", type: "image" },
  { key: "file_url", label: "PDF link", type: "url", helper: "Paste a Google Drive share link or any public URL." },
];

export const blogPostFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, helper: "Used in the URL — lowercase letters, numbers and hyphens only." },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "date", label: "Date", type: "text", required: true },
  { key: "author", label: "Author", type: "text", required: true },
  { key: "read_minutes", label: "Read time", type: "text", required: true, helper: "e.g. \"6 min read\"" },
  { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
  { key: "content", label: "Body paragraphs", type: "list", helper: "One paragraph per line." },
  { key: "image_url", label: "Cover image", type: "image" },
];

export const upcomingProgramFields: FieldConfig[] = [
  { key: "title", label: "Title / tag", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, helper: "Used in the URL — lowercase letters, numbers and hyphens only." },
  { key: "subtitle", label: "Subtitle", type: "text", required: true },
  { key: "theme", label: "Theme", type: "textarea", required: true },
  { key: "summary", label: "Summary", type: "textarea", required: true },
  { key: "date", label: "Date", type: "text", required: true },
  {
    key: "event_end_date",
    label: "Event end date",
    type: "date",
    helper: "Last day of the event. Used to auto-tag it \"Past\" and move it into the archive once it's over. Leave blank if unsure.",
  },
  { key: "venue", label: "Venue", type: "text", required: true },
  { key: "image_url", label: "Cover image", type: "image" },
  { key: "audience", label: "Who can apply", type: "list", helper: "One item per line." },
  { key: "skills", label: "What they'll learn", type: "list", helper: "One item per line." },
  { key: "apply_url", label: "Apply link", type: "url" },
  { key: "application_deadline", label: "Application deadline", type: "text" },
  { key: "closing_note", label: "Closing note", type: "textarea" },
  { key: "partner_note", label: "Partner note", type: "text" },
  { key: "hashtags", label: "Hashtags", type: "list", helper: "One tag per line, without the # symbol." },
];

export const galleryImageFields: FieldConfig[] = [
  { key: "image_url", label: "Image", type: "image", required: true },
  { key: "caption", label: "Caption", type: "textarea", required: true },
  { key: "tall", label: "Tall card", type: "boolean" },
];

export const leadershipFields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role", type: "text", required: true },
  {
    key: "team",
    label: "Team",
    type: "select",
    required: true,
    options: [
      { value: "executive", label: "Board of Trustee" },
      { value: "management", label: "Management Team" },
    ],
  },
  { key: "photo_url", label: "Photo", type: "image" },
];

export const toolkitGuideFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "date", label: "Date", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "file_url", label: "PDF / resource link", type: "url", helper: "Paste a Google Drive share link or any public URL." },
];

export const pressStatementFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "date", label: "Date", type: "text", required: true },
  { key: "body", label: "Statement", type: "textarea", required: true },
  { key: "file_url", label: "Full statement link", type: "url", helper: "Optional — link to a PDF or external article." },
];

export const opportunityFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { value: "full-time", label: "Full-time" },
      { value: "fellowship", label: "Fellowship" },
      { value: "internship", label: "Internship" },
      { value: "volunteer", label: "Volunteer" },
    ],
  },
  { key: "location", label: "Location", type: "text", required: true, helper: "e.g. \"Abuja, Nigeria\" or \"Remote\"." },
  { key: "deadline", label: "Apply by", type: "text", required: true, helper: "A date, or words like \"Rolling\" or \"Open\"." },
  { key: "description", label: "Short description", type: "textarea", helper: "Optional — shown on the opportunity card." },
];
