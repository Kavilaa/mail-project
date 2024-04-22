import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persistedUser = sessionStorage.getItem("user");
    if (persistedUser) {
      setUser(JSON.parse(persistedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  const logout = async () => {
    await axiosInstance.post("/user/logout");
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
