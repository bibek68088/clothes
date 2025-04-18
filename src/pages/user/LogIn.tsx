import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconShoppingBag,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useAuth } from "../../store/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleFacebookLogin = () => {
    alert("Facebook login not implemented");
  };

  const handleGithubLogin = () => {
    alert("GitHub login not implemented");
  };

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
            Log in to your account
          </Text>

          {errorMessage && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              className="mb-4"
            >
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

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />

            <Group justify="space-between" className="mb-4">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
              />
              <Text
                component={Link}
                to="/forgot-password"
                size="sm"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Text>
            </Group>

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Log in
            </Button>

            <Text c="dimmed" size="sm" className="text-center mt-3">
              Don't have an account?{" "}
              <Text
                component={Link}
                to="/signup"
                className="text-blue-600 hover:underline cursor-pointer"
              >
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
              onClick={handleFacebookLogin}
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              leftSection={<IconBrandGithub size={16} />}
              className="border-gray-300 hover:bg-gray-50"
              onClick={handleGithubLogin}
            >
              GitHub
            </Button>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}
