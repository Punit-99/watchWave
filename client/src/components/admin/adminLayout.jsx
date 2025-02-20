import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "../ui/sidebar";
import AdminHeader from "./AdminHeader";

const Layout = () => {
  const [title, setTitle] = useState("Overview"); // Default title

  return (
    <SidebarProvider className="h-screen w-screen">
      <div className="grid h-full w-full grid-cols-[250px_1fr] md:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <aside className="h-full p-5 md:block hidden">
          <AdminSidebar setTitle={setTitle} />
        </aside>
        {/* Main Content */}
        <main
          className="p-5 m-2 rounded-lg h-[calc(100vh-16px)] overflow-auto
          shadow-[0px_0px_15px_15px_rgba(0,_0,_0,_0.1)]"
        >
          <AdminHeader title={title} />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
