"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User } from "../types";
import { apiClient } from "../lib/api-client";
import { deleteCookie } from "cookies-next"; // Import deleteCookie for consistency

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void; // Updated to match api-client's logoutUser
    refreshUser: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiClient.get("/users/me", {
                    withCredentials: true, // Important: include cookies
                });

                if (response.status === 200) {
                    const userData = response.data;
                    setUser(userData);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await apiClient("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Important: include cookies
            data: { email, password },
        });

        if (response.status !== 200) {
            const error = response.data;
            throw new Error(error.error || "Login failed");
        }

        const data = response.data;

        // Set user data (token is in cookie)
        setUser(data.user);
    }, []);

    const signup = useCallback(
        async (name: string, email: string, password: string) => {
            const response = await apiClient("/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // Important: include cookies
                data: { name, email, password },
            });

            if (response.status !== 200) {
                const error = response.data;
                throw new Error(error.error || "Signup failed");
            }

            const data = response.data;

            // Auto-login after signup
            setUser(data.user);
        },
        []
    );

    const logout = useCallback(() => {
        console.log("Logging out user..."); // Debugging log
        deleteCookie("auht_token");
        deleteCookie("refreshToken");
        setUser(null);  
        console.log("User logged out, cookies deleted."); // Debugging log
        window.location.href = "/login"; // Redirect to login page
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const response = await apiClient("/users/me", {
                withCredentials: true,
            });

            if (response.status === 200) {
                const userData = response.data;
                setUser(userData);
            }
        } catch (error) {
            console.error("Refresh user failed:", error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, signup, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
