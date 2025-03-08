import { useEffect, useState } from "react";
import {
  FINAL_initialState,
  FINAL_showBasicFormControls,
} from "../../../../config/formFields";

import { AdminForm } from "../../../common/common-Form/adminForm";

export const ShowBasicDetails = ({ setCategory }) => {
  const [showBasicDetails, setShowBasicDetails] = useState(FINAL_initialState);

  // ✅ Handle Category Change
  const handleCategoryChange = (formData) => {
    setShowBasicDetails(formData);
    setCategory(formData.category); // ✅ Update Category in Parent
  };

  return (
    <div className="flex-1 p-4 bg-gray-700 rounded-md">
      <h2 className="text-lg font-semibold text-white mb-4">Details</h2>

      <AdminForm
        formControls={FINAL_showBasicFormControls}
        formData={showBasicDetails}
        setFormData={handleCategoryChange}
      />
    </div>
  );
};
