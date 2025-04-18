import { useState } from "react"
import {
  Container,
  Paper,
  Title,
  Text,
  Tabs,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Avatar,
  Divider,
  Switch,
  Select,
  Grid,
  Alert,
} from "@mantine/core"
import { useAuth } from "../../store/useAuth"
import { User, Lock, Bell, MapPin, Shield, Check, X } from "lucide-react"

export function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    accountAlerts: true,
  })

  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      await updateProfile(profileForm)
      setSuccess(true)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
       await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError("Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      setError("Failed to update address. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      setError("Failed to update notification preferences. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Group mb="xl" align="flex-start">
          <Avatar size="xl" radius="xl" color="blue">
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <div>
            <Title order={2}>{user?.name}</Title>
            <Text c="dimmed">{user?.email}</Text>
            {user?.role === "admin" && (
              <Text size="sm" className="mt-1">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  <Shield size={12} /> Admin
                </span>
              </Text>
            )}
          </div>
        </Group>

        <Tabs value={activeTab} onChange={(value: string | null) => value && setActiveTab(value)}>
          <Tabs.List mb="md">
            <Tabs.Tab value="profile" leftSection={<User size={16} />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="password" leftSection={<Lock size={16} />}>
              Password
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<Bell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="address" leftSection={<MapPin size={16} />}>
              Address
            </Tabs.Tab>
            {user?.role === "admin" && (
              <Tabs.Tab value="admin" leftSection={<Shield size={16} />}>
                Admin Settings
              </Tabs.Tab>
            )}
          </Tabs.List>

          {/* Profile Tab */}
          <Tabs.Panel value="profile">
            {success && (
              <Alert icon={<Check size={16} />} title="Success" color="green" mb="md">
                Your profile has been updated successfully.
              </Alert>
            )}

            {error && (
              <Alert icon={<X size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <form onSubmit={handleProfileSubmit}>
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                mb="md"
              />

              <TextInput
                label="Email Address"
                placeholder="john@example.com"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                mb="md"
              />

              <TextInput
                label="Phone Number"
                placeholder="+1 (123) 456-7890"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                mb="xl"
              />

              <Group justify="flex-end">
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </Group>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="password">
            {success && (
              <Alert icon={<Check size={16} />} title="Success" color="green" mb="md">
                Your password has been updated successfully.
              </Alert>
            )}

            {error && (
              <Alert icon={<X size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <PasswordInput
                label="Current Password"
                placeholder="Enter your current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                mb="md"
              />

              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                mb="md"
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                mb="xl"
              />

              <Group justify="flex-end">
                <Button type="submit" loading={loading}>
                  Update Password
                </Button>
              </Group>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="notifications">
            {success && (
              <Alert icon={<Check size={16} />} title="Success" color="green" mb="md">
                Your notification preferences have been updated.
              </Alert>
            )}

            {error && (
              <Alert icon={<X size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <form onSubmit={handleNotificationSubmit}>
              <div className="space-y-4 mb-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <Text fw={500}>Email Notifications</Text>
                    <Text size="sm" c="dimmed">
                      Receive email notifications
                    </Text>
                  </div>
                  <Switch
                    checked={notificationPrefs.emailNotifications}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        emailNotifications: e.currentTarget.checked,
                      })
                    }
                  />
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <div>
                    <Text fw={500}>Order Updates</Text>
                    <Text size="sm" c="dimmed">
                      Receive updates about your orders
                    </Text>
                  </div>
                  <Switch
                    checked={notificationPrefs.orderUpdates}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        orderUpdates: e.currentTarget.checked,
                      })
                    }
                  />
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <div>
                    <Text fw={500}>Promotional Emails</Text>
                    <Text size="sm" c="dimmed">
                      Receive emails about promotions and discounts
                    </Text>
                  </div>
                  <Switch
                    checked={notificationPrefs.promotions}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        promotions: e.currentTarget.checked,
                      })
                    }
                  />
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <div>
                    <Text fw={500}>Account Alerts</Text>
                    <Text size="sm" c="dimmed">
                      Receive security and account-related alerts
                    </Text>
                  </div>
                  <Switch
                    checked={notificationPrefs.accountAlerts}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        accountAlerts: e.currentTarget.checked,
                      })
                    }
                  />
                </div>
              </div>

              <Group justify="flex-end">
                <Button type="submit" loading={loading}>
                  Save Preferences
                </Button>
              </Group>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="address">
            {success && (
              <Alert icon={<Check size={16} />} title="Success" color="green" mb="md">
                Your address has been updated successfully.
              </Alert>
            )}

            {error && (
              <Alert icon={<X size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <form onSubmit={handleAddressSubmit}>
              <TextInput
                label="Street Address"
                placeholder="123 Main St"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                required
                mb="md"
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="City"
                    placeholder="New York"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                    mb="md"
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    label="State/Province"
                    placeholder="NY"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                    mb="md"
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="ZIP/Postal Code"
                    placeholder="10001"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    required
                    mb="md"
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Select
                    label="Country"
                    placeholder="Select country"
                    value={addressForm.country}
                    onChange={(value) => setAddressForm({ ...addressForm, country: value || "" })}
                    data={[
                      { value: "United States", label: "United States" },
                      { value: "Canada", label: "Canada" },
                      { value: "United Kingdom", label: "United Kingdom" },
                      { value: "Australia", label: "Australia" },
                      { value: "Germany", label: "Germany" },
                      { value: "France", label: "France" },
                      { value: "Japan", label: "Japan" },
                    ]}
                    required
                    mb="xl"
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end">
                <Button type="submit" loading={loading}>
                  Save Address
                </Button>
              </Group>
            </form>
          </Tabs.Panel>

          {user?.role === "admin" && (
            <Tabs.Panel value="admin">
              <Title order={3} mb="md">
                Admin Settings
              </Title>

              <Paper withBorder p="md" mb="md">
                <Text fw={500} mb="xs">
                  Site Configuration
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Configure global site settings and appearance
                </Text>
                <Button component="a" href="/admin" variant="light">
                  Go to Admin Dashboard
                </Button>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={500} mb="xs">
                  User Management
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Manage users, roles and permissions
                </Text>
                <Button component="a" href="/admin/users" variant="light">
                  Manage Users
                </Button>
              </Paper>

              <Paper withBorder p="md">
                <Text fw={500} mb="xs">
                  Product Management
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Manage products, inventory and categories
                </Text>
                <Button component="a" href="/admin/products" variant="light">
                  Manage Products
                </Button>
              </Paper>
            </Tabs.Panel>
          )}
        </Tabs>
      </Paper>
    </Container>
  )
}

