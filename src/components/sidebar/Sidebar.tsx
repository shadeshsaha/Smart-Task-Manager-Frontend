import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Teams", path: "/teams" },
    { name: "Members", path: "/members" },
    { name: "Tasks", path: "/tasks" },
    { name: "Reassign", path: "/reassign" },
    { name: "Activity", path: "/activity" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">Smart Task Manager</h2>
      <ul>
        {links.map((link) => (
          <li
            key={link.path}
            className={location.pathname === link.path ? "font-bold" : ""}
          >
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
