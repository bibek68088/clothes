import type React from "react";
import { useState } from "react";
import {
  MantineProvider,
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
} from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconShoppingBag,
} from "@tabler/icons-react";

const navigateToSignup = () => {
  window.location.href = "/signup";
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
    <MantineProvider
      theme={{
        primaryColor: "blue",
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Container size="xs" className="w-full">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <IconShoppingBag size={32} className="text-blue-600" />
              <Title order={1} className="text-2xl font-bold">
                StyleHub
              </Title>
            </div>
          </div>

          <Paper radius="md" p="xl" withBorder className="w-full">
            <Title order={2} className="text-center mb-2">
              Welcome Back
            </Title>
            <Text color="dimmed" size="sm" className="text-center mb-5">
              Sign in to your account to continue
            </Text>

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
                <Text
                  component="a"
                  href="#"
                  size="xs"
                  className="text-blue-600 hover:underline"
                >
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

              <Button
                type="submit"
                fullWidth
                className="bg-blue-600 hover:bg-blue-700"
              >
                Log In
              </Button>

              <Text color="dimmed" size="sm" className="text-center mt-3">
                Don't have an account?{" "}
                <Text
                  component="a"
                  onClick={navigateToSignup}
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
    </MantineProvider>
  );
};

export default LoginPage;
