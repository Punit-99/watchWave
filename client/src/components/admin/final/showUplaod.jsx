import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowBasicDetails } from "./tabs/ShowBasicDetails";
import { ShowFileUpload } from "./tabs/showFileUplaod";
import { ScrollArea } from "../../ui/scroll-area";

export const ShowUpload = () => {
  const [activeTab, setActiveTab] = useState("showDetails");
  const [category, setCategory] = useState(""); // ✅ Store Category

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-md">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="showDetails">Show Details</TabsTrigger>
            <TabsTrigger value="showUpload">Show Upload</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="my-2 bg-gray-600" />

      <div className="p-4 bg-gray-700 rounded-md">
        <ScrollArea className="w-full flex-1 overflow-auto h-[415px]">
          {activeTab === "showDetails" && (
            <ShowBasicDetails setCategory={setCategory} />
          )}
          {activeTab === "showUpload" && (
            <ShowFileUpload category={category} />
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
