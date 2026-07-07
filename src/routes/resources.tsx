import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Media — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs, research reports, toolkits and news coverage from CREAP Africa Initiative." },
    ],
  }),
  component: Resources,
});

function Resources() {
  const { location } = useRouterState();

  if (location.pathname === "/resources") {
    return <Navigate to="/resources/policy-briefs" />;
  }

  return <Outlet />;
}
