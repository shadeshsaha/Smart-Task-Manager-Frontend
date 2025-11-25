import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider>
        <Sidebar />
      </Sider>
      <AntLayout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
