import React, { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  initialLoading: true,
});

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const checkStatus = async () => {
    try {
      const response = await axiosInstance.get("/user/status");
      setUser(response.data.user);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        setUser(null);
      } else {
        console.error("Error checking user status:", error);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
