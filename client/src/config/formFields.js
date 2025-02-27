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
    componentType: "toggle-group",
    options: [
      { value: "action", label: "Action" },
      { value: "adventure", label: "Adventure" },
      { value: "comedy", label: "Comedy" },
      { value: "drama", label: "Drama" },
      { value: "fantasy", label: "Fantasy" },
      { value: "horror", label: "Horror" },
      { value: "romance", label: "Romance" },
      { value: "documentary", label: "Documentary" },
      { value: "sci-fi", label: "Sci-Fi" },
      { value: "thriller", label: "Thriller" },
      { value: "mystery", label: "Mystery" },
      { value: "crime", label: "Crime" },
      { value: "war", label: "War" },
    ],
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

export const showInitialFormData = {
  title: "DBZ",
  description:
    "Dragon Ball Z follows the adventures of Goku who, along with the Z Warriors, defends the Earth against evil. The action adventures are entertaining and reinforce the concept of good versus evil. Dragon Ball Z teaches valuable character virtues such as teamwork, loyalty, and trustworthiness.",
  genre: ["action", "adventure"],
  releaseDate: "",
  category: "",
  rating: "10",
};

export const showVideoInitialFormData = {
  movie: { videoFile: null },
  webseries: [],
};

export const showMediaInitialFormData = {
  poster: null,
  thumbnail: null,
};
