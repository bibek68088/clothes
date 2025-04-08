import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    try {
      await signup(name, email, password)
      // Redirect to home page after successful signup
      navigate("/", { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Signup failed")
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
            Create Account
          </Title>
          <Text c="dimmed" size="sm" className="text-center mb-5">
            Sign up to start shopping with us
          </Text>

          {errorMessage && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" className="mb-4">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Full Name"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3"
            />

            <TextInput
              label="Email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4"
            />

            <Checkbox
              label={
                <Text size="sm">
                  I agree to the{" "}
                  <Text component="a" href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text component="a" href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Text>
                </Text>
              }
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
              required
              className="mb-4"
            />

            <Button
              type="submit"
              fullWidth
              disabled={!agreeTerms}
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Button>

            <Text c="dimmed" size="sm" className="text-center mt-3">
              Already have an account?{" "}
              <Text component={Link} to="/login" className="text-blue-600 hover:underline cursor-pointer">
                Log in
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

