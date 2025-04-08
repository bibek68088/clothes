import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Text,
  Divider,
  Group,
  Container,
  Alert,
} from "@mantine/core"
import "@mantine/core/styles.css"
import { IconBrandFacebook, IconBrandGithub, IconShoppingBag, IconAlertCircle } from "@tabler/icons-react"
import { useAuth } from "../../store/useAuth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      await login(email, password)
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container size="xs" className="w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <IconShoppingBag size={32} className="text-blue-600" />
            <Title order={1} className="text-2xl font-bold">
              Aashish
            </Title>
          </div>
        </div>

        <Paper radius="md" p="xl" withBorder className="w-full">
          <Title order={2} className="text-center mb-2">
            Welcome Back
          </Title>
          <Text c="dimmed" size="sm" className="text-center mb-5">
            Sign in to your account to continue shopping
          </Text>

          {errorMessage && (
            <Alert icon={<IconAlertCircle size={16} />} title="Authentication Error" color="red" className="mb-4">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
            />

            <div className="flex justify-between items-center mb-1">
              <Text component="label" htmlFor="password" size="sm" fw={500}>
                Password
              </Text>
              <Text component={Link} to="/forgot-password" size="xs" className="text-blue-600 hover:underline">
                Forgot password?
              </Text>
            </div>

            <PasswordInput
              id="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />

            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
              className="mb-4"
            />

            <Button type="submit" fullWidth className="bg-blue-600 hover:bg-blue-700" loading={isLoading}>
              Log In
            </Button>

            <Text c="dimmed" size="sm" className="text-center mt-3">
              Don't have an account?{" "}
              <Text component={Link} to="/signup" className="text-blue-600 hover:underline cursor-pointer">
                Sign up
              </Text>
            </Text>
          </form>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow>
            <Button
              variant="outline"
              leftSection={<IconBrandFacebook size={16} />}
              className="border-gray-300 hover:bg-gray-50"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              leftSection={<IconBrandGithub size={16} />}
              className="border-gray-300 hover:bg-gray-50"
            >
              GitHub
            </Button>
          </Group>
        </Paper>
      </Container>
    </div>
  )
}

