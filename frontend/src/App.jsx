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
import { SentPage } from "./pages/SentPage";
import { ArchivedPage } from "./pages/ArchivedPage";
import { ComposePage } from "./pages/ComposePage";
import { InboxPage } from "./pages/InboxPage";

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
        <Route element={<ProtectedRoute />}>
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/sent" element={<SentPage />} />
          <Route path="/archived" element={<ArchivedPage />} />
          <Route path="/compose" element={<ComposePage />} />
        </Route>

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
