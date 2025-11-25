import { Layout as AntLayout } from "antd";
import Sidebar from "./Sidebar";

const { Header, Content, Footer } = AntLayout;

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <AntLayout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Smart Task Manager ©2025
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
