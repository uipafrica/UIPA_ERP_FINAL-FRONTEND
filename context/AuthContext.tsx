"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/types";
import { authApi, ApiError } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for stored auth data on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we have access token cookie by making a test API call
      const response = await fetch(
        // Use relative path in browser so cookies are included for this origin
        process.env.NEXT_PUBLIC_API_URL_health || "/api/health",
        {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // We have a valid session, but we need user data
        // Try to get user data from localStorage first (if available)
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
        } else {
          // If no stored user data, we'll need to get it from another endpoint
          // For now, we'll create a minimal user object and update it later
          setUser({
            id: "current",
            email: "current@user.com", // This should be updated from a profile endpoint
            role: "employee" as UserRole,
            firstName: "Current",
            lastName: "User",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        // No valid session, clear any stored data
        localStorage.removeItem("user_data");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear invalid data
      localStorage.removeItem("user_data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Make actual API call to backend
      const response = await authApi.login(email, password);

      // Create user object with backend data
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role as UserRole,
        // Extract name from email as fallback since backend doesn't return firstName/lastName
        firstName: email.split("@")[0].split(".")[0] || "User",
        lastName: email.split("@")[0].split(".")[1] || "",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store only user data in localStorage (tokens are now in HTTP-only cookies)
      localStorage.setItem("user_data", JSON.stringify(userData));

      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific API errors
      if (error instanceof ApiError) {
        console.error("API Error:", error.message, "Status:", error.status);
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HTTP-only cookies and invalidate tokens
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    }

    // Clear stored user data
    localStorage.removeItem("user_data");

    setUser(null);
    router.push("/login");
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Make actual API call to refresh token (refresh token comes from HTTP-only cookie)
      const response = await authApi.refresh();

      // Token refresh successful - new tokens are automatically set as HTTP-only cookies by backend
      return response.success || true;
    } catch (error) {
      console.error("Token refresh error:", error);

      // Handle specific API errors
      if (error instanceof ApiError) {
        console.error(
          "Refresh API Error:",
          error.message,
          "Status:",
          error.status
        );
      }

      // If refresh fails, logout user
      await logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
