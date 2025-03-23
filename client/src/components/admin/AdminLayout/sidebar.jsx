import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { SidebarProvider } from "../../ui/sidebar";

const AppSidebar = () => {
  return (
    <SidebarProvider className="w-64">
      <Sidebar className="bg-gray-900 text-gray-100 w-64 h-[calc(100vh-64px)] mt-[72px] fixed">
        {/* Sidebar Header */}
        <SidebarHeader>
          <h1 className="text-lg font-bold">WatchWave</h1>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          {/* Navigation Links Group 1 */}
          <SidebarGroup>
            <Link
              to="/dashboard"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
            <Link to="/shows" className="block p-2 hover:bg-gray-700 rounded">
              Shows
            </Link>
            <Link to="/users" className="block p-2 hover:bg-gray-700 rounded">
              Users
            </Link>
          </SidebarGroup>

          {/* Navigation Links Group 2 */}
          <SidebarGroup>
            <Link
              to="/settings"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Settings
            </Link>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
          <Link to="/logout" className="block p-2 hover:bg-red-700 rounded">
            Logout
          </Link>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
