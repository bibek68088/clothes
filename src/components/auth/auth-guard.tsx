import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../store/useAuth"
import { Loader } from "@mantine/core"

interface AuthGuardProps {
  children: ReactNode
  adminRequired?: boolean
}

export function AuthGuard({ children, adminRequired = false }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page and save the location they were trying to access
      navigate("/login", { state: { from: location.pathname } })
    } else if (adminRequired && user?.role !== "admin") {
      // If admin access is required but user is not an admin, redirect to home
      navigate("/")
    }
  }, [isAuthenticated, user, adminRequired, navigate, location.pathname])

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  if (adminRequired && user?.role !== "admin") {
    return null // This will be replaced by the redirect in the useEffect
  }

  return <>{children}</>
}

