/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to={"/auth/sign-in"} />;
    } else {
      return user?.role === "admin" ? (
        <Navigate to={"/admin/dashboard"} />
      ) : (
        <Navigate to={"/movies/home"} />
      );
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/auth/sign-in") ||
      location.pathname.includes("/auth/sign-up")
    )
  ) {
    return <Navigate to="/auth/sign-in" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/sign-in") ||
      location.pathname.includes("/auth-sign-up"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to={"/admin/dashboard"} />
    ) : (
      <Navigate to={"/movies/home"} />
    );
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to={"/unauth-page"} />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("movies")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
