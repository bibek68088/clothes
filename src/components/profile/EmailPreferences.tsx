import { useState } from "react";
import { Paper, Title, Switch, Group, Button, Text } from "@mantine/core";

interface EmailPreferencesProps {
  initialPreferences: {
    orderConfirmation: boolean;
    orderStatusUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  onUpdate: (preferences: any) => void;
}

export function EmailPreferences({
  initialPreferences,
  onUpdate,
}: EmailPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
    setSuccess(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      onUpdate(preferences);
      setSuccess(true);
    } catch (error) {
      console.error("Error updating email preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={4} className="mb-4">
        Email Notifications
      </Title>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Text fw={500}>Order Confirmations</Text>
            <Text size="sm" color="dimmed">
              Receive emails when you place an order
            </Text>
          </div>
          <Switch
            checked={preferences.orderConfirmation}
            onChange={() => handleToggle("orderConfirmation")}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Text fw={500}>Order Status Updates</Text>
            <Text size="sm" color="dimmed">
              Receive emails when your order status changes
            </Text>
          </div>
          <Switch
            checked={preferences.orderStatusUpdates}
            onChange={() => handleToggle("orderStatusUpdates")}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Text fw={500}>Promotions and Discounts</Text>
            <Text size="sm" color="dimmed">
              Receive emails about special offers and discounts
            </Text>
          </div>
          <Switch
            checked={preferences.promotions}
            onChange={() => handleToggle("promotions")}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Text fw={500}>Newsletter</Text>
            <Text size="sm" color="dimmed">
              Receive our monthly newsletter
            </Text>
          </div>
          <Switch
            checked={preferences.newsletter}
            onChange={() => handleToggle("newsletter")}
          />
        </div>
      </div>

      <Group justify="right" className="mt-4">
        {success && (
          <Text color="green" size="sm">
            Preferences updated successfully!
          </Text>
        )}
        <Button onClick={handleSubmit} loading={loading}>
          Save Preferences
        </Button>
      </Group>
    </Paper>
  );
}
