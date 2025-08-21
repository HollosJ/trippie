import { type ReactNode } from "react";
import { useAuth } from "../providers/auth";
import { Navigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <span>Loading...</span>;

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
