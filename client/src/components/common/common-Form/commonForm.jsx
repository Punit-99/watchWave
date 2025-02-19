/* eslint-disable react/prop-types */

import FormControls from "./FormControls";
import { Button } from "../../ui/button";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button
        disabled={isButtonDisabled}
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50 mt-2"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
export default CommonForm;
