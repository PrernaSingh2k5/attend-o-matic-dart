
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  hideFooter?: boolean;
}

export function Layout({ children, requireAuth = false, hideFooter = false }: LayoutProps) {
  const { user } = useAuth();

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in and trying to access login/register page, redirect to dashboard
  if (user && !requireAuth) {
    return user.role === "teacher" ? (
      <Navigate to="/teacher" />
    ) : (
      <Navigate to="/student" />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
