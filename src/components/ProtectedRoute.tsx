import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  // original props in your file
  adminOnly?: boolean;
  researcherOnly?: boolean;
  // also accept the names used in App.tsx
  requireAdmin?: boolean;
  requireResearcher?: boolean;
};

export function ProtectedRoute({
  children,
  adminOnly,
  researcherOnly,
  requireAdmin,
  requireResearcher,
}: Props) {
  const { user, loading, isAdmin, isResearcher } = useAuth();
  const location = useLocation();

  // normalize both prop styles
  const needsAdmin = Boolean(adminOnly ?? requireAdmin);
  const needsResearcher = Boolean(researcherOnly ?? requireResearcher);

  // wait until auth finishes rehydrating on refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

   

  // not logged in -> send to login and keep the intended target to navigate back after login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // role checks
  if (needsAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  if (needsResearcher && !isResearcher) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
