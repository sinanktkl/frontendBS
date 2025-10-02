import React, { createContext, useState, useEffect } from "react";
import { LoginAPI, GetUserAPI } from "../Services/allApi";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async ({ email, password, remember }) => {
    try {
      const res = await LoginAPI({ email, password });
      if (res?.status === 200) {
        console.log(res);
        
        const token = res.data.token;

        // ✅ Save token: localStorage if remember, sessionStorage if not
        if (remember) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        setUser(res.data.user);
        return { success: true };
      } else {
        return { success: false, message: res?.data?.message || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: "Server error" };
    }
  };

  // Fetch user from token
  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const res = await GetUserAPI(token);
      if (res?.status === 200) {
        setUser(res.data);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};