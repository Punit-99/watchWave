export const registerFormControls = [
  {
    name: "userName",
    label: "UserName",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const LoginFormControl = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    componentType: "input",
  },
];
// Show Basic Information Form Controls
export const showBasicFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter show title",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    placeholder: "Enter show description",
  },
  {
    name: "genre",
    label: "Genre",
    componentType: "input",
    type: "text",
    placeholder: "Enter genre",
  },
  {
    name: "releaseDate",
    label: "Release Date",
    componentType: "date",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    options: [
      { value: "movie", label: "Movie" },
      { value: "webseries", label: "Web Series" },
    ],
  },
  {
    name: "rating",
    label: "Rating",
    componentType: "input",
    type: "number",
    placeholder: "Enter rating (out of 10)",
  },
];

// Initial form data
export const showInitialFormData = {
  title: "",
  description: "",
  genre: "",
  releaseDate: "",
  category: "",
  rating: "",
};

export const showVideoInitialFormData = [
  {
    title: "",
    videoUrl: "",
    public_id: "",
  },
];
export const showMediaInitialFormData = {
  posterUrl: "",
  thumbnailUrls: [],
};
