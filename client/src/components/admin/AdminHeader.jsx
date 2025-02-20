import { Button } from "../ui/button";

/* eslint-disable react/prop-types */
function AdminHeader({ title, onButtonClick }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <h2 className="text-black text-xl font-semibold">{title}</h2>
      <div className="flex flex-1 justify-end">
        {/* Trigger modal open */}
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          onClick={onButtonClick}
        >
          Upload Show
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
