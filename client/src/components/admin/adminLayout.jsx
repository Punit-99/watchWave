import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "../ui/sidebar";
import AdminHeader from "./AdminHeader";
import DialogBox from ".././common/dialog-box/dialogBox";

const Layout = () => {
  const [title, setTitle] = useState("Overview"); // Default title
  const [dialogOpen, setDialogOpen] = useState(false); // Manage Dialog state

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
          <AdminHeader title={title} setDialogOpen={setDialogOpen} />
          <Outlet />
        </main>
      </div>

      {/* Global Dialog Box */}
      <DialogBox dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}>
        {/* Content inside the dialog */}
        <p>Dialog Content Here</p>
      </DialogBox>
    </SidebarProvider>
  );
};

export default Layout;
