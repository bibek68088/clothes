import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../store/useAuth"

// Add adminRequired prop to the interface
interface AuthGuardProps {
  children: ReactNode
  adminRequired?: boolean
}

// Update the component to check for admin role when needed
export function AuthGuard({ children, adminRequired = false }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page and save the intended destination
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      })
    } else if (adminRequired && user?.role !== "admin") {
      // If admin access is required but user is not an admin, redirect to home
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, navigate, location, adminRequired, user])

  // If authenticated and has proper permissions, render the children
  return isAuthenticated && (!adminRequired || user?.role === "admin") ? <>{children}</> : null
}

