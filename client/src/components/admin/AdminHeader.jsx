/* eslint-disable react/prop-types */
import { Button } from "../ui/button";

function AdminHeader({ title }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <h2 className="text-black text-xl font-semibold">{title}</h2>
      <div className="flex flex-1 justify-end">
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          onClick={() => console.log("hello")} // Log "hello" on button click
        >
          Click
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
