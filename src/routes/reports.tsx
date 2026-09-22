import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — CREAP Africa Initiative" },
      { name: "description", content: "Project reports, annual reports and financial reports from CREAP Africa Initiative." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { location } = useRouterState();

  if (location.pathname === "/reports") {
    return <Navigate to="/reports/project-reports" />;
  }

  return <Outlet />;
}
