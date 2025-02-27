/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { LayoutDashboard, Film, Users, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import capitalizeFirstLetter from "../common/helper/capitalizeFirstLetter ";
import { logoutUser } from "../../store/auth-slice/authSlice";
import toast from "react-hot-toast";

const sidebarMenu = [
  {
    id: "dashboard",
    label: "Overview",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "movies",
    label: "Movies & Shows",
    path: "/admin/shows",
    icon: <Film />,
  },
  {
    id: "users",
    label: "User Management",
    path: "/admin/users",
    icon: <Users />,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: <Settings />,
  },
];

const populateMenu = (navigate, setTitle) => {
  return sidebarMenu.map((item) => (
    <SidebarMenuItem key={item.id}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200"
        onClick={() => {
          navigate(item.path);
          setTitle(item.label); // Update title on click
        }}
      >
        {item.icon}
        <span className="text-lg">{item.label}</span>
      </motion.div>
    </SidebarMenuItem>
  ));
};

const AdminSidebar = ({ setTitle }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Sidebar variant="floating" className="min-w-[250px] bg-gray-500">
      <SidebarHeader className="flex flex-row items-center">
        <Avatar>
          <AvatarImage src={""} />
        </Avatar>
        <span className="font-bold">
          Hello {capitalizeFirstLetter(user.userName)}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm uppercase tracking-wider">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{populateMenu(navigate, setTitle)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 bg-red-400 text-white"
            >
              <button
                className="flex gap-3"
                onClick={() => {
                  dispatch(logoutUser()).then(() =>
                    toast.success("Logged Out!")
                  );
                }}
              >
                <LogOut />
                <span className="text-lg">Sign Out</span>
              </button>
            </motion.div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
