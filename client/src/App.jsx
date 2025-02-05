/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import NotFound from "./pages/not-found/notFound";
import Unauth from "./pages/unauth/unauth";
import Login from "./pages/auth/login";
import Registration from "./pages/auth/registration";
import AdminLayout from "./components/admin-view/adminLayout";
import CheckAuth from "./components/common/checkAuth";
import Home from "./pages/home";
import { useSelector } from "react-redux";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        {/* AUTH ROUTE */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="sign-in" element={<Login />} />
          <Route path="sign-up" element={<Registration />} />
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
          {/* <Route path="" element={}/>  */}
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
