import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, isLoading } = useAuth() as {
    register: (
      name: string,
      email: string,
      phone: string,
      password: string
    ) => Promise<void>;
    isLoading: boolean;
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await register(name, email, phone, password);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Signup failed");
    }
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
            Create Account
          </Title>
          <Text c="dimmed" size="sm" className="text-center mb-5">
            Sign up to get started
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
              label="Name"
              placeholder="Your full name"
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
            <TextInput
              label="Phone"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-3"
            />
            <PasswordInput
              label="Password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>

            <Text c="dimmed" size="sm" className="text-center mt-3">
              Already have an account?{" "}
              <Text
                component={Link}
                to="/login"
                className="text-blue-600 hover:underline cursor-pointer"
              >
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
  );
}
