import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Initiatives — CREAP Africa Initiative" },
      { name: "description", content: "Explore CREAP's programs in civic education, climate action, youth empowerment, oral health in schools and community dialogue." },
    ],
  }),
  component: Programs,
});

function Programs() {
  const { location } = useRouterState();

  if (location.pathname === "/programs") {
    return <Navigate to="/programs/our-key-programs" />;
  }

  return <Outlet />;
}
