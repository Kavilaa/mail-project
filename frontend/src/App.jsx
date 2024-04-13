import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { RootLayout } from "./pages/RootLayout";
import { AuthContext, AuthContextProvider } from "./components/AuthContext";
import { useContext } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
// import { ProfilePage } from "./pages/ProfilePage";

const ProtectedRoute = () => {
  const { user, initialLoading } = useContext(AuthContext);

  if (initialLoading) return null;

  if (user !== null) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        {/* <Route index element={<div>Products page</div>} /> */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route> */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};
