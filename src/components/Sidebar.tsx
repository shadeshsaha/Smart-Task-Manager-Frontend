import {
  DashboardOutlined,
  ProfileOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/projects", icon: <ProjectOutlined />, label: "Projects" },
    { key: "/teams", icon: <TeamOutlined />, label: "Teams" },
    { key: "/tasks", icon: <ProfileOutlined />, label: "Tasks" },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={(e) => navigate(e.key)}
      items={items}
      style={{ height: "100vh" }}
    />
  );
};

export default Sidebar;
