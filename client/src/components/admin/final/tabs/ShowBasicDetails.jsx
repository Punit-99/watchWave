/* eslint-disable react/prop-types */
import { FINAL_showBasicFormControls } from "../../../../config/formFields";
import { AdminForm } from "../../../common/common-Form/adminForm";

export const ShowBasicDetails = ({ showDetails, setShowDetails }) => {
  return (
    <div className="flex-1 p-4 bg-gray-700 rounded-md">
      <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
      {console.log(showDetails)}
      {console.log(setShowDetails)}
      <AdminForm
        formControls={FINAL_showBasicFormControls}
        formData={showDetails}
        setFormData={setShowDetails}
      />
    </div>
  );
};
