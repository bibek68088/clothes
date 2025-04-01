import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Grid,
  Divider,
  Radio,
  Group,
  Alert,
  LoadingOverlay,
  PasswordInput,
} from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconCheck,
  IconCreditCard,
  IconTruck,
  IconBrandPaypal,
  IconLock,
  IconShieldLock,
} from "@tabler/icons-react";
import { useCart } from "../../store/useCart";
import { useAuth } from "../../store/useAuth";
import { AuthGuard } from "../../components/auth/auth-guard";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation } from "@tanstack/react-query";
import {
  createOrder,
  processPayment,
  verifyAddress,
} from "./hooks/useCheckout";
import { useForm } from "@mantine/form";
import { z } from "zod";

// Form validation schema
const shippingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  street: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().min(2, "Please enter a valid state"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  country: z.string().min(2, "Please enter a valid country"),
});

const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Card number must be valid")
    .max(19, "Card number must be valid")
    .refine(
      (val) => /^[0-9]+$/.test(val),
      "Card number must contain only digits"
    ),
  cardName: z.string().min(3, "Name on card is required"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be in MM/YY format"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3-4 digits"),
});

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [isAddressVerified, setIsAddressVerified] = useState(false);

  // Form handling with validation
  const shippingForm = useForm({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
    validate: (values) => {
      try {
        shippingSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.formErrors.fieldErrors;
        }
        return {};
      }
    },
  });

  const creditCardForm = useForm({
    initialValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    },
    validate: (values) => {
      try {
        creditCardSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.formErrors.fieldErrors;
        }
        return {};
      }
    },
  });

  // Calculate order totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (totalItems === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [totalItems, navigate, orderPlaced]);

  // Address verification mutation
  const verifyAddressMutation = useMutation({
    mutationFn: verifyAddress,
    onSuccess: () => {
      setIsAddressVerified(true);
    },
    onError: () => {
      // Handle address verification error
      shippingForm.setErrors({
        street: "Could not verify address",
        city: "Could not verify address",
        state: "Could not verify address",
        zipCode: "Could not verify address",
      });
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderId(data.orderId);
      if (paymentMethod === "credit-card") {
        processPaymentMutation.mutate({
          orderId: data.orderId,
          paymentMethod,
          paymentDetails: creditCardForm.values,
        });
      }
      // For PayPal, payment is handled by PayPal SDK
    },
    onError: () => {
      setLoading(false);
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: processPayment,
    onSuccess: () => {
      setOrderPlaced(true);
      clearCart();

      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate(`/order-confirmation/${orderId}`);
      }, 2000);
    },
    onError: () => {
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Verify address before submitting
  const handleVerifyAddress = () => {
    const shippingData = shippingForm.values;
    if (Object.keys(shippingForm.validate()).length === 0) {
      verifyAddressMutation.mutate(shippingData);
    }
  };

  // Credit card submission handler
  const handleCreditCardSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAddressVerified) {
      handleVerifyAddress();
      return;
    }

    if (Object.keys(creditCardForm.validate()).length === 0) {
      setLoading(true);

      // Create order first
      createOrderMutation.mutate({
        items,
        shippingDetails: shippingForm.values,
        total,
        subtotal,
        tax,
        shipping,
      });
    }
  };

  // PayPal handlers
  const createPayPalOrder = async () => {
    if (!isAddressVerified) {
      handleVerifyAddress();
      throw new Error("Please verify your address first");
    }

    try {
      setLoading(true);
      const orderData = {
        items,
        shippingDetails: shippingForm.values,
        total,
        subtotal,
        tax,
        shipping,
      };

      const response = await createOrder(orderData);
      setOrderId(response.orderId);
      return response.paypalOrderId;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const onPayPalApprove = async (data: { orderID: string; payerID?: string | null }) => {
      try {
        if (!data.payerID) {
          console.warn("Payer ID is missing, proceeding without it.");
        }
  
        await processPayment({
          orderId,
          paymentMethod: "paypal",
          paymentDetails: {
            paypalOrderId: data.orderID,
            paypalPayerId: data.payerID || null,
          },
        });
  
        setOrderPlaced(true);
        clearCart();
  
        // Redirect to order confirmation
        setTimeout(() => {
          navigate(`/order-confirmation/${orderId}`);
        }, 2000);
      } catch (error) {
        setLoading(false);
      }
    };

  // Generate a random 3-digit security code for the CVV field placeholder
  useEffect(() => {
    setSecurityCode(Math.floor(Math.random() * 900 + 100).toString());
  }, []);

  // Mask card number input
  const formatCardNumber = (value: string) => {
    if (!value) return "";
    const onlyNumbers = value.replace(/\D/g, "");
    let formattedValue = "";

    for (let i = 0; i < onlyNumbers.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue +=
        i < 4 || i >= onlyNumbers.length - 4 ? onlyNumbers[i] : "*";
    }

    return formattedValue;
  };

  if (orderPlaced) {
    return (
      <Container size="md" className="py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <IconCheck size={48} className="text-green-600" />
          </div>
        </div>
        <Title order={2} className="mb-4">
          Order Placed Successfully!
        </Title>
        <Text size="lg" className="mb-8">
          Thank you for your purchase. We're processing your order now. Your
          order ID is: {orderId}
        </Text>
        <Button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen py-8">
        <Container size="lg">
          <div className="flex items-center mb-8">
            <IconShieldLock size={28} className="mr-3 text-green-600" />
            <div>
              <Title order={1}>Secure Checkout</Title>
              <Text size="sm" color="dimmed">
                All information is encrypted and secure
              </Text>
            </div>
          </div>

          <form onSubmit={handleCreditCardSubmit}>
            <Grid gutter={32}>
              <Grid.Col span={12} fw={8}>
                <Paper radius="md" p="xl" withBorder className="mb-6 relative">
                  <LoadingOverlay visible={verifyAddressMutation.isPending} />

                  <Title order={3} className="mb-4">
                    <IconTruck size={20} className="mr-2 inline-block" />
                    Shipping Information
                  </Title>

                  <Grid>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Full Name"
                        placeholder="John Doe"
                        required
                        {...shippingForm.getInputProps("name")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="Email"
                        placeholder="name@example.com"
                        required
                        {...shippingForm.getInputProps("email")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="Phone"
                        placeholder="(123) 456-7890"
                        required
                        {...shippingForm.getInputProps("phone")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <TextInput
                        label="Street Address"
                        placeholder="123 Main St"
                        required
                        {...shippingForm.getInputProps("street")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="City"
                        placeholder="New York"
                        required
                        {...shippingForm.getInputProps("city")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="State/Province"
                        placeholder="NY"
                        required
                        {...shippingForm.getInputProps("state")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="Zip/Postal Code"
                        placeholder="10001"
                        required
                        {...shippingForm.getInputProps("zipCode")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12} fw={6}>
                      <TextInput
                        label="Country"
                        placeholder="United States"
                        required
                        {...shippingForm.getInputProps("country")}
                        className="mb-3"
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Button
                        variant="outline"
                        onClick={handleVerifyAddress}
                        disabled={isAddressVerified}
                        className="mt-2"
                      >
                        {isAddressVerified
                          ? "Address Verified ✓"
                          : "Verify Address"}
                      </Button>
                      {isAddressVerified && (
                        <Text size="sm" color="green" className="mt-2">
                          Your address has been verified.
                        </Text>
                      )}
                    </Grid.Col>
                  </Grid>
                </Paper>

                <Paper radius="md" p="xl" withBorder className="relative">
                  <LoadingOverlay visible={loading} />

                  <Title order={3} className="mb-4">
                    <IconCreditCard size={20} className="mr-2 inline-block" />
                    Payment Method
                  </Title>

                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <IconLock size={16} className="mr-2 text-green-600" />
                      <Text size="sm" color="dimmed">
                        Your payment information is secured with
                        industry-standard encryption
                      </Text>
                    </div>
                  </div>

                  <Radio.Group
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    className="mb-4"
                    required
                  >
                    <Group>
                      <Radio
                        value="credit-card"
                        label={
                          <div className="flex items-center">
                            <IconCreditCard size={18} className="mr-2" />
                            <span>Credit Card</span>
                          </div>
                        }
                      />
                      <Radio
                        value="paypal"
                        label={
                          <div className="flex items-center">
                            <IconBrandPaypal size={18} className="mr-2" />
                            <span>PayPal</span>
                          </div>
                        }
                      />
                    </Group>
                  </Radio.Group>

                  {paymentMethod === "credit-card" && (
                    <Grid>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Card Number"
                          placeholder="4111 1111 1111 1111"
                          required
                          {...creditCardForm.getInputProps("cardNumber")}
                          value={formatCardNumber(
                            creditCardForm.values.cardNumber
                          )}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            creditCardForm.setFieldValue("cardNumber", value);
                          }}
                          className="mb-3"
                          leftSection={<IconCreditCard size={16} />}
                        />
                      </Grid.Col>

                      <Grid.Col span={12}>
                        <TextInput
                          label="Name on Card"
                          placeholder="John Doe"
                          required
                          {...creditCardForm.getInputProps("cardName")}
                          className="mb-3"
                        />
                      </Grid.Col>

                      <Grid.Col span={6}>
                        <TextInput
                          label="Expiry Date"
                          placeholder="MM/YY"
                          required
                          {...creditCardForm.getInputProps("expiry")}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");

                            // Format as MM/YY
                            if (value.length > 0) {
                              if (value.length <= 2) {
                                value = value;
                              } else {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2, 4);
                              }
                            }

                            creditCardForm.setFieldValue("expiry", value);
                          }}
                          className="mb-3"
                        />
                      </Grid.Col>

                      <Grid.Col span={6}>
                        <PasswordInput
                          label="CVV"
                          placeholder={securityCode}
                          required
                          {...creditCardForm.getInputProps("cvv")}
                          className="mb-3"
                          visibilityToggleIcon={({ reveal }) =>
                            reveal ? (
                              <IconLock size={16} />
                            ) : (
                              <IconLock size={16} />
                            )
                          }
                        />
                      </Grid.Col>

                      <Grid.Col span={12}>
                        <Button
                          type="submit"
                          className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800"
                          disabled={!isAddressVerified || loading}
                        >
                          {loading ? "Processing..." : "Place Order"}
                        </Button>
                      </Grid.Col>
                    </Grid>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="mt-4">
                      <Alert color="blue" className="mb-4">
                        <div className="flex items-center">
                          <IconBrandPaypal size={20} className="mr-2" />
                          <span>
                            Complete your purchase securely with PayPal
                          </span>
                        </div>
                      </Alert>

                      <PayPalScriptProvider
                        options={{
                          clientId: "YOUR_PAYPAL_CLIENT_ID",
                          currency: "USD",
                          intent: "capture",
                        }}
                      >
                        <div
                          className={
                            !isAddressVerified
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }
                        >
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={createPayPalOrder}
                            onApprove={onPayPalApprove}
                            onError={() => setLoading(false)}
                            onCancel={() => setLoading(false)}
                            disabled={!isAddressVerified}
                          />
                        </div>
                      </PayPalScriptProvider>

                      {!isAddressVerified && (
                        <Text color="red" size="sm" className="mt-2">
                          Please verify your address before proceeding with
                          PayPal
                        </Text>
                      )}
                    </div>
                  )}
                </Paper>
              </Grid.Col>

              <Grid.Col span={12} fw={4}>
                <Paper radius="md" p="xl" withBorder className="sticky top-4">
                  <Title order={3} className="mb-4">
                    Order Summary
                  </Title>

                  <div className="max-h-60 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center py-2 border-b"
                      >
                        <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <Text size="sm" fw={500}>
                            {item.name}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {item.selectedColor &&
                              `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " | "}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </Text>
                          <Text size="xs">Qty: {item.quantity}</Text>
                        </div>
                        <div className="text-right">
                          <Text size="sm" fw={500}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider my="sm" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Subtotal</Text>
                      <Text>${subtotal.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Shipping</Text>
                      <Text>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Tax</Text>
                      <Text>${tax.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <Text fw={700}>Total</Text>
                      <Text fw={700}>${total.toFixed(2)}</Text>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <IconShieldLock
                        size={16}
                        className="mr-2 text-green-600"
                      />
                      <Text size="sm" fw={500}>
                        Secure Checkout
                      </Text>
                    </div>
                    <Text size="xs" color="dimmed">
                      Your information is protected using SSL encryption.
                    </Text>
                  </div>
                </Paper>
              </Grid.Col>
            </Grid>
          </form>
        </Container>
      </div>
    </AuthGuard>
  );
}
