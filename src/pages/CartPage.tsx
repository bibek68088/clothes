"use client";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Image,
  NumberInput,
  ActionIcon,
  Divider,
  Paper,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import { useCart } from "../store/useCart";

export function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  // Add null check to prevent the reduce error
  const subtotal =
    items && items.length > 0
      ? items.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;

  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!items || items.length === 0) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Title order={2} mb="md">
            Your Cart
          </Title>
          <Text mb="xl">Your cart is empty.</Text>
          <Button component={Link} to="/products" variant="filled" color="blue">
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">
        Your Cart
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {items.map((item) => (
            <Card key={item.id} mb="md" p="md" radius="md" withBorder>
              <div className="flex flex-col sm:flex-row gap-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={100}
                  height={100}
                  fit="contain"
                />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <Text fw={500} size="lg">
                        {item.name}
                      </Text>
                      <Text size="sm" color="dimmed" mb="xs">
                        Size: {item.size}
                      </Text>
                    </div>
                    <Text fw={700}>${item.price.toFixed(2)}</Text>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <NumberInput
                        value={item.quantity}
                        min={1}
                        max={10}
                        onChange={(value) =>
                          updateQuantity(item.id, Number(value))
                        }
                        styles={{ input: { width: 60 } }}
                      />
                    </div>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash size={18} />
                    </ActionIcon>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button component={Link} to="/products" variant="outline" mt="md">
            Continue Shopping
          </Button>
        </div>

        <div>
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">
              Order Summary
            </Title>

            <div className="space-y-3 mb-4">
              <Group justify="space-between">
                <Text>Subtotal</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </Group>

              <Group justify="space-between">
                <Text>Shipping</Text>
                <Text>${shipping.toFixed(2)}</Text>
              </Group>

              <Group justify="space-between">
                <Text>Tax</Text>
                <Text>${tax.toFixed(2)}</Text>
              </Group>

              <Divider my="sm" />

              <Group justify="space-between">
                <Text fw={700}>Total</Text>
                <Text fw={700} size="lg">
                  ${total.toFixed(2)}
                </Text>
              </Group>
            </div>

            <Button component={Link} to="/checkout" fullWidth color="blue">
              Proceed to Checkout
            </Button>
          </Paper>
        </div>
      </div>
    </Container>
  );
}
