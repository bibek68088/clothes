import { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Container,
  Grid,
  Divider,
  Alert,
  Box,
  Group,
  Avatar,
  Text,
  ThemeIcon,
  Transition,
} from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconAlertCircle,
  IconUser,
  IconHistory,
  IconMapPin,
  IconCreditCard,
  IconLogout,
  IconCheck,
  IconChevronRight,
} from "@tabler/icons-react";
import { useAuth } from "../../store/useAuth";
import { Link } from "react-router-dom";
import { EmailPreferences, EmailPreferencesProps } from "../../components/profile/EmailPreferences";
export default function ProfilePage() {
  const { user, updateProfile, isLoading, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const initialEmailPreferences = {
    orderConfirmation: true,
    orderStatusUpdates: true,
    promotions: false,
    newsletter: false,
  };
  const [city, setCity] = useState(user?.address?.city || "");
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferencesProps['initialPreferences']>(initialEmailPreferences);
  const [state, setState] = useState(user?.address?.state || "");
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || "");
  const [country, setCountry] = useState(user?.address?.country || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateProfile({
        name,
        email,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      });

      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Profile update failed"
      );
    }
  };

  const menuItems = [
    {
      label: "Profile",
      icon: <IconUser size={18} />,
      path: "/profile",
      active: true,
    },
    {
      label: "Order History",
      icon: <IconHistory size={18} />,
      path: "/orders",
      active: false,
    },
    {
      label: "Payment Methods",
      icon: <IconCreditCard size={18} />,
      path: "/payment-methods",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Container size="xl" className="py-8">
        <Paper
          radius="lg"
          p={0}
          withBorder
          shadow="md"
          className="overflow-hidden"
        >
          <Grid gutter={0} className="m-0">
            <Grid.Col
              span={{ base: 12, md: 3 }}
              className="p-0 border-r border-gray-200"
            >
              <div className="py-6">
                <div className="px-4 mb-6 flex flex-col items-center">
                  <Avatar
                    size={80}
                    color="blue.6"
                    radius="xl"
                    className="mb-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-4 border-white shadow-md"
                  >
                    {name.slice(0, 1)}
                  </Avatar>
                  <Title order={4} className="font-semibold text-center">
                    {name || "Welcome"}
                  </Title>
                  <div className="mt-6">
                    <EmailPreferences
                      initialPreferences={emailPreferences}
                      onUpdate={setEmailPreferences}
                    />
                  </div>
                  <Text
                    size="sm"
                    className="text-gray-600 text-center truncate w-full"
                  >
                    {email || "Update your details below"}
                  </Text>

                  <Button
                    variant="subtle"
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={() => logout()}
                    className="mt-4 text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>

                <Divider mb="md" />

                <Text
                  size="sm"
                  fw={600}
                  className="text-gray-600 uppercase tracking-wide px-4 mb-4"
                >
                  Account Navigation
                </Text>

                <div className="flex flex-col items-start space-y-1 px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="no-underline"
                    >
                      <Button
                        variant={item.active ? "light" : "subtle"}
                        fullWidth
                        className={`justify-start rounded-lg px-3 h-12 ${
                          item.active
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        leftSection={
                          <ThemeIcon
                            size={32}
                            radius="md"
                            className={
                              item.active ? "bg-blue-100" : "bg-gray-100"
                            }
                          >
                            {item.icon}
                          </ThemeIcon>
                        }
                        rightSection={
                          <IconChevronRight
                            size={16}
                            className="text-gray-400"
                          />
                        }
                      >
                        <Box ml={6}>
                          <Text size="sm" fw={500}>
                            {item.label}
                          </Text>
                        </Box>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 9 }} className="p-0">
              <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
                <Title order={2} className="font-semibold">
                  My Account
                </Title>
                <Text size="sm" className="opacity-80">
                  Update your personal details and preferences
                </Text>
              </Box>
              <Paper radius={0} p="xl" className="h-full">
                <Title order={3} className="mb-6 font-semibold text-gray-800">
                  Profile Information
                </Title>

                <Transition
                  mounted={!!errorMessage}
                  transition="slide-down"
                  duration={400}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Alert
                      style={styles}
                      icon={<IconAlertCircle size={16} />}
                      title="Error"
                      color="red"
                      className="mb-4"
                      withCloseButton
                      onClose={() => setErrorMessage(null)}
                    >
                      {errorMessage}
                    </Alert>
                  )}
                </Transition>

                <Transition
                  mounted={!!successMessage}
                  transition="slide-down"
                  duration={400}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Alert
                      style={styles}
                      icon={<IconCheck size={16} />}
                      title="Success"
                      color="green"
                      className="mb-4"
                      withCloseButton
                      onClose={() => setSuccessMessage(null)}
                    >
                      {successMessage}
                    </Alert>
                  )}
                </Transition>

                <form onSubmit={handleSubmit}>
                  <Grid>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Full Name"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Phone"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Divider
                        my="md"
                        label={
                          <Group gap={4}>
                            <IconMapPin size={16} />
                            <Text>Shipping Address</Text>
                          </Group>
                        }
                        labelPosition="center"
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <TextInput
                        label="Street Address"
                        placeholder="123 Main St"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="City"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="State/Province"
                        placeholder="NY"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Zip/Postal Code"
                        placeholder="10001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Country"
                        placeholder="United States"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        radius="md"
                        size="md"
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} className="mt-4">
                      <Button
                        type="submit"
                        loading={isLoading}
                        size="md"
                        radius="md"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                      >
                        Save Changes
                      </Button>
                    </Grid.Col>
                  </Grid>
                </form>
              </Paper>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
