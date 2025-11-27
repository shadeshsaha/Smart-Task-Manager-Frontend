/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DashboardOutlined,
  HistoryOutlined,
  LogoutOutlined,
  ProjectOutlined,
  SwapOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/teams", icon: <TeamOutlined />, label: "Teams" },
    { key: "/projects", icon: <ProjectOutlined />, label: "Projects" },
    { key: "/tasks", icon: <UnorderedListOutlined />, label: "Tasks" },
    { key: "/reassign", icon: <SwapOutlined />, label: "Reassign" },
    { key: "/activity-log", icon: <HistoryOutlined />, label: "Activity Log" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const onMenuClick = (e: any) => {
    if (e.key === "logout") {
      onLogout();
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {!collapsed ? "Smart Task Manager" : "STM"}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          onClick={onMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#fff", padding: "0 20px" }}>
          <Title level={4} style={{ margin: 0 }}>
            Smart Task Manager
          </Title>
        </Header>
        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
