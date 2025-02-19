/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
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
            <SelectContent className="w-full p-2 border rounded">
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

      // Date Picker
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData[getControlItem.name]}
                onSelect={(selectedDate) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: selectedDate,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
        break;

      // Toggle Group for Genre selection
      case "toggle":
        element = (
          <ToggleGroup
            type="multiple"
            value={formData[getControlItem.name] || []}
            onValueChange={(values) => {
              setFormData({ ...formData, [getControlItem.name]: values });
            }}
            className="flex gap-2"
          >
            {getControlItem.options.map((optionItem) => (
              <ToggleGroupItem key={optionItem.value} value={optionItem.value}>
                {optionItem.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
        break;

      case "file":
        element = (
          <Input
            type="file"
            accept="video/*"
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

      // Default Input Field (Fallback)
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
