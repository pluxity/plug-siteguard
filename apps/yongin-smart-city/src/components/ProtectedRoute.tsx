interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Add authentication logic when AuthStore is implemented
  // const { isAuthenticated, user } = useAuthStore()
  // const location = useLocation()
  //
  // if (!isAuthenticated || !user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />
  // }

  return <>{children}</>;
}
