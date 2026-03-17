"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken(true);
        
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!res.ok) {
          await signOut(auth);
          setUser(null);
        } else {
          setUser(firebaseUser);
        }
      } catch (error) {
        console.error("Auth error:", error);
        await signOut(auth);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const logout = async () => {
    try {
      await signOut(auth);

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};