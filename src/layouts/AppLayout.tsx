import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "../components/sidebar/Sidebar";

type Props = { children: React.ReactNode };

export default function AppLayout({ children }: Props) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
