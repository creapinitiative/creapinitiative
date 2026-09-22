import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs, toolkits, guides, press statements, gallery and blogs from CREAP Africa Initiative." },
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
