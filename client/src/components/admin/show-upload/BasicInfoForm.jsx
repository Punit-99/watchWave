/* eslint-disable react/prop-types */
import FormControls from "../../common/common-Form/FormControls";
import { showBasicFormControls } from "../../../config/formFields";

// List of available genres

export default function BasicInfoForm({ showFormData, setShowFormData }) {
  // Function to handle genre selection

  return (
    <FormControls
      formControls={showBasicFormControls}
      formData={showFormData}
      setFormData={setShowFormData}
    />
  );
}
