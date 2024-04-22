import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { ActiveLinkButton, Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { axiosInstance } from "../lib/axiosInstance";
import "../querry.css";
import archived from "../assets/archived.svg";
import compose from "../assets/compose.svg";
import inbox from "../assets/inbox.svg";
import logout from "../assets/logout.svg";
import login from "../assets/login.svg";
import register from "../assets/register.svg";
import sent from "../assets/sent.svg";

export const RootLayout = () => {
  const { user, initialLoading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axiosInstance.delete("/user/logout", { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - Unable to log out.");
        setUser(null);
        navigate("/");
      } else {
        console.error("Error during logout:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="flex justify-between items-center border-b gap-2 py-4">
        <h1 className="text-2xl hidden md:inline-block">
          <Link to="/">Mail</Link>
        </h1>
        {initialLoading ? (
          <div className="flex w-full md:w-auto justify-evenly gap-4 md:ml-auto">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ) : user ? (
          <>
            <ul className="flex gap-2">
              <li>
                <ActiveLinkButton
                  variant="outline"
                  to="/inbox"
                  className="button"
                >
                  <img src={inbox} alt="Inbox icon" className="icon" />
                  <span>Inbox</span>
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton
                  variant="outline"
                  to="/sent"
                  className="button"
                >
                  <img src={sent} alt="Sent icon" className="icon" />
                  <span>Sent</span>
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton
                  variant="outline"
                  to="/archived"
                  className="button"
                >
                  <img src={archived} alt="Archived icon" className="icon" />
                  <span>Archived</span>
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton
                  variant="outline"
                  to="/compose"
                  className="button"
                >
                  <img src={compose} alt="Compose icon" className="icon" />
                  <span>Compose</span>
                </ActiveLinkButton>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              <span>{user.email}</span>
              <Button variant="outline" onClick={logoutUser} className="button">
                <img src={logout} alt="Log out icon" className="icon" />
                <span>Log out</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <ActiveLinkButton variant="outline" to="login" className="button">
              <img src={login} alt="Login icon" className="icon" />
              <span>Login</span>
            </ActiveLinkButton>
            <ActiveLinkButton
              variant="outline"
              to="register"
              className="button"
            >
              <img src={register} alt="Register icon" className="icon" />
              <span>Register</span>
            </ActiveLinkButton>
          </div>
        )}
      </header>
      <main className="my-8">
        <Outlet />
      </main>
    </div>
  );
};
