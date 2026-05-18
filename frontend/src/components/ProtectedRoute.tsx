import { Navigate } from "react-router-dom";

import { getToken } from "../utils/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
