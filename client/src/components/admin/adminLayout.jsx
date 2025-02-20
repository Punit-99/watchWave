import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "../ui/sidebar";
import AdminHeader from "./AdminHeader";

const Layout = () => {
  const [title, setTitle] = useState("Overview");
  const [openModal, setOpenModal] = useState(false); // Modal state here!

  return (
    <SidebarProvider className="h-screen w-screen">
      <div className="grid h-screen w-screen grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <aside className="h-full p-5 md:block hidden">
          <AdminSidebar setTitle={setTitle} />
        </aside>

        {/* Main Content */}
        <main className="p-5 m-2 rounded-lg h-[calc(100vh-16px)] overflow-auto shadow-md">
          {/* Header now triggers modal open */}
          <AdminHeader title={title} onButtonClick={() => setOpenModal(true)} />
          
          {/* Outlet context provides modal state to child routes */}
          <Outlet context={[openModal, setOpenModal]} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
