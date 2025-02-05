/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectItem, SelectValue } from "../ui/select";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisable,
}) => {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
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
                  <SelectItem key={optionItem.id} value={optionItem.label}>
                    {optionItem.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        {Array.isArray(formControls) && formControls.map((controlItem) => (
          <div key={controlItem.label} className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
        <Button
          disabled={isBtnDisable}
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CommonForm;
