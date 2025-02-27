/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";

const FormControls = ({ formControls = [], formData, setFormData }) => {
  // Function to render inputs dynamically based on component type
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      // Input Field
      case "input":
        element = (
          <Input
            className="w-full p-2 border rounded"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      // Select Dropdown
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [getControlItem.name]: value })
            }
            value={value}
          >
            <SelectTrigger className="w-full p-2 border rounded">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent className="w-full  border rounded bg-white">
              {getControlItem.options &&
                getControlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.value} value={optionItem.value}>
                    {optionItem.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            className="w-full p-2 border rounded min-h-25"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      // Toggle Group (Genre Selection)

      case "toggle-group":
        element = (
          <ToggleGroup
            type="multiple"
            className="flex flex-wrap gap-2"
            value={formData[getControlItem.name] || []} // Ensure it's always an array
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: Array.isArray(value) ? value : [value], // Ensure it's always an array
              })
            }
          >
            {getControlItem.options.map((optionItem) => (
              <ToggleGroupItem
                key={optionItem.value}
                value={optionItem.value}
                className={`px-3 py-2 border rounded ${
                  formData[getControlItem.name]?.includes(optionItem.value)
                    ? "bg-gray-300" // Add active state styling
                    : ""
                }`}
              >
                {optionItem.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
        break;

      // Date Picker (Better Date Format)
      case "date":
        element = (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full p-2 border rounded ${
                  !formData[getControlItem.name] && "text-muted-foreground"
                }`}
              >
                {formData[getControlItem.name]
                  ? new Date(formData[getControlItem.name]).toLocaleDateString()
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 z-[1000] pointer-events-auto"
              align="start"
            >
              <Calendar
                className="rounded-md border-none shadow bg-white"
                mode="single"
                selected={
                  formData[getControlItem.name]
                    ? new Date(formData[getControlItem.name])
                    : undefined
                }
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setFormData({
                      ...formData,
                      [getControlItem.name]: selectedDate
                        .toISOString()
                        .split("T")[0], // Saves as YYYY-MM-DD
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
        break;

      // File Upload (Dynamic Accept Type)
      case "file":
        element = (
          <Input
            type="file"
            accept={getControlItem.accept || "video/*"} // Allows dynamic file types
            className="w-full p-2 border rounded"
            name={getControlItem.name}
            id={getControlItem.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.files[0],
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            className="w-full p-2 border rounded"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label>
          {renderInputsByComponentType(controleItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
