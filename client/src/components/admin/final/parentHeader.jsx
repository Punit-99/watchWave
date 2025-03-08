import { useSidebar } from "@/components/ui/sidebar";
import { Search, Plus } from "lucide-react"; // Icons from Lucide
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShowUpload } from "./showUplaod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "../../ui/separator";

export const CustomTrigger = () => {
  //   const { toggleSidebar } = useSidebar();

  return (
    <button className="text-gray-300 hover:text-white">
      ☰ {/* Simple Hamburger Icon */}
    </button>
  );
};

const ParentHead = () => {
  return (
    <header className="w-full bg-gray-800 p-4 flex items-center justify-between shadow-md">
      {/* Left: Hamburger Menu + Logo */}
      <div className="flex items-center space-x-4">
        <CustomTrigger /> {/* Sidebar Toggle Button */}
        <h1 className="text-xl font-bold text-gray-100">WatchWave</h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search..."
          className="bg-gray-700 text-gray-100 border-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Right: Create Button + Avatar */}
      <div className="flex items-center space-x-4">
        {/* Dialog (Modal) for "Create" */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-gray-100 border-gray-600 hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100 border border-gray-600 w-[1055px] h-[600px] max-w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <Separator />
              <ShowUpload />
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Avatar */}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>WW</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default ParentHead;
