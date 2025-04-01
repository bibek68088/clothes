import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../store/useAuth"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page and save the intended destination
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [isAuthenticated, navigate, location])

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null
}

