import { createFileRoute, redirect } from "@tanstack/react-router";

// Opportunities now live on the Get Involved page; keep old links and bookmarks working.
export const Route = createFileRoute("/opportunities")({
  beforeLoad: () => {
    throw redirect({ to: "/get-involved", hash: "opportunities", replace: true });
  },
});
