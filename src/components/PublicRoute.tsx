import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  if (user) {
    return <Navigate to="/upload" replace />; // Redirect to upload if already authenticated
  }

  return children; // Render the public component if not authenticated
}