// components/Layout.jsx
import ParentHead from "./parentHeader";
import AppSidebar from "./sidebar";
import { SidebarProvider } from "../../ui/sidebar";
import SecondHeader from "./childHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Full-width Parent Head */}
      <ParentHead />

      <div className="flex flex-1">
        {/* Sidebar */}

        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Second Header */}
          <SecondHeader />

          {/* Outlet for Dynamic Pages */}
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
