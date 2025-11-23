import { Button } from "@/components/ui/button"; // shadcn Button
import {
  CalendarIcon,
  ClipboardListIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const nav = [
  { name: "Dashboard", to: "/", icon: <HomeIcon size={16} /> },
  { name: "Projects", to: "/projects", icon: <ClipboardListIcon size={16} /> },
  { name: "Teams", to: "/teams", icon: <UsersIcon size={16} /> },
  //   { name: "Members", to: "/Members", icon: <UsersIcon size={16} /> }, // Members
  { name: "Tasks", to: "/tasks", icon: <CalendarIcon size={16} /> },
  { name: "Reassign", to: "/reassign", icon: <ClipboardListIcon size={16} /> },
  { name: "Activity", to: "/activity", icon: <ClipboardListIcon size={16} /> },
];
export default function Sidebar() {
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        transition: "width 0.2s",
        borderRight: "1px solid var(--muted)",
        padding: 12,
        background: "var(--card-background)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--accent)",
              borderRadius: 6,
            }}
          />
          {!collapsed && <strong>Smart Task</strong>}
        </div>
        <Button size="sm" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: loc.pathname === item.to ? "var(--accent)" : "inherit",
              background:
                loc.pathname === item.to ? "var(--muted)" : "transparent",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
