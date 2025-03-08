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
        <main className="bg-[#292928] overflow-auto">
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
