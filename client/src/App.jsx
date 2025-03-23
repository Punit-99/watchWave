/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import NotFound from "./pages/not-found-view/notFound";
import Unauth from "./pages/unauth-view/unauth";
import Login from "./pages/auth-view/login";
import Registration from "./pages/auth-view/registration";
import CheckAuth from "./components/common/check-auth/checkAuth";
import LandingHome from "./pages/landing-view/landingHome";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./pages/admin-view/dashboard";
import { checkAuth } from "./store/auth-slice/authSlice";
import { useEffect } from "react";
import AdminShows from "./pages/admin-view/shows";
import AdminLayout from "./components/admin/AdminLayout/AdminLayout";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<LandingHome />} />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="shows" element={<AdminShows />} />
        </Route>

        <Route path="/movies" element={<div>Movies Page</div>} />

        <Route path="/unauth-page" element={<Unauth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
