/* eslint-disable react/prop-types */
import FormControls from "../../common/common-Form/FormControls";
import { showBasicFormControls } from "../../../config/formFields";
import CommonForm from "../../common/common-Form/commonForm";

export default function BasicInfoForm({ showFormData, setShowFormData }) {
  return (
    <div>
      <FormControls
        formControls={showBasicFormControls}
        formData={showFormData}
        setFormData={setShowFormData}
      />
    </div>
  );
}
