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

export const uploadMovieFormControls = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "movie", label: "Movie" },
      { id: "tv_show", label: "TV Show" },
      { id: "web_series", label: "Web Series" },
    ],
  },
  {
    label: "Genres",
    name: "genres",
    componentType: "select",
    multiple: true,
    options: [
      { id: "action", label: "Action" },
      { id: "comedy", label: "Comedy" },
      { id: "drama", label: "Drama" },
      { id: "horror", label: "Horror" },
      { id: "sci-fi", label: "Sci-Fi" },
      { id: "thriller", label: "Thriller" },
      { id: "romance", label: "Romance" },
      { id: "animation", label: "Animation" },
    ],
  },
  {
    label: "Release Date",
    name: "releaseDate",
    componentType: "input",
    type: "date",
    placeholder: "Select release date",
  },
  {
    label: "Poster Image",
    name: "poster",
    componentType: "file",
    type: "file",
    placeholder: "Upload poster image",
  },
  {
    label: "Trailer URL",
    name: "trailerUrl",
    componentType: "input",
    type: "url",
    placeholder: "Enter trailer URL",
  },
  {
    label: "Video URL",
    name: "videoUrl",
    componentType: "input",
    type: "url",
    placeholder: "Enter video URL",
  },
  {
    label: "Rating (IMDb)",
    name: "rating",
    componentType: "input",
    type: "number",
    placeholder: "Enter rating (0-10)",
  },
  {
    label: "Is Featured?",
    name: "isFeatured",
    componentType: "checkbox",
    type: "checkbox",
  },
];
