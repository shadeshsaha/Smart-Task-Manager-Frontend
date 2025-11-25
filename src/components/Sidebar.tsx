import {
  DashboardOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ProjectOutlined,
  RetweetOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //   const items = [
  //     { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
  //     { key: "/projects", icon: <ProjectOutlined />, label: "Projects" },
  //     { key: "/teams", icon: <TeamOutlined />, label: "Teams" },
  //     { key: "/tasks", icon: <ProfileOutlined />, label: "Tasks" },
  //   ];

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/teams", icon: <TeamOutlined />, label: "Teams" },
    { key: "/projects", icon: <ProjectOutlined />, label: "Projects" },
    { key: "/tasks", icon: <FileTextOutlined />, label: "Tasks" },
    { key: "/reassign", icon: <RetweetOutlined />, label: "Reassign" },
    { key: "/activity", icon: <HistoryOutlined />, label: "Activity Logs" },
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div
        style={{
          height: 32,
          margin: 16,
          color: "#fff",
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        Smart Task Manager
      </div>

      <Menu
        theme="dark"
        mode="inline"
        // selectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        // style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default Sidebar;
