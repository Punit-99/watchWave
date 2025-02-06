import { LayoutDashboard, Popcorn } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useNavigate } from "react-router-dom";

const sidebarMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/shows",
    icon: <Popcorn />,
  },
  // {
  //   id: "orders",
  //   label: "Orders",
  //   path: "/admin/orders",
  //   icon: <BadgeCheck />,
  // },
];

// function MenuItems() {
//   const navigate = useNavigate();

//   return (
//     <nav className="mt-8 flex-col flex gap-2">
//       {sidebarMenu.map((menuItem) => (
//         <div
//           key={menuItem.id}
//           onClick={() => {
//             navigate(menuItem.path);
//           }}
//           className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
//         >
//           {menuItem.icon}
//           <span>{menuItem.label}</span>
//         </div>
//       ))}
//     </nav>
//   );
// }

const AdminSidebar = () => {
  return (
    <Sidebar variant="floating" className="min-w-[250px]">
      <SidebarContent className="shadow-[0px_0px_15px_15px_rgba(0,_0,_0,_0.1)] rounded-lg">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenu.map((item) => (
                <SidebarMenuItem key={item?.id}>
                  <SidebarMenuButton asChild>
                    <a href={item?.path} className="flex items-center gap-2">
                      {item?.icon}
                      <span>{item?.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AdminSidebar;
