/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import NotFound from "./pages/not-found-view/notFound";
import Unauth from "./pages/unauth-view/unauth";
import Login from "./pages/auth-view/login";
import Registration from "./pages/auth-view/registration";
import AdminLayout from "./components/admin/adminLayout";
import CheckAuth from "./components/common/checkAuth";
import LandingHome from "./pages/landing-view/landingHome"; // Correct import for LandingHome
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./pages/admin-view/dashboard";
import { checkAuth } from "./store/auth-slice/authSlice";
import { useEffect } from "react";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* HOME */}
        <Route path="/" element={<LandingHome />} /> {/* Use LandingHome component */}
        {/* AUTH ROUTE */}
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

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* STREAM */}
        <Route path="/movies"></Route>

        <Route path="/unauth-page" element={<Unauth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
