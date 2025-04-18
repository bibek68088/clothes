import { client } from "./graphqlClient";
import { getAuthHeaders } from "../../../components/utils/auth";
import {
  VERIFY_ADDRESS,
  CREATE_ORDER,
  PROCESS_PAYMENT,
  APPLY_PROMO_CODE,
} from "../../../components/auth/mutations";
import { GET_SHIPPING_METHODS } from "../../../components/auth/queries";

export const verifyAddress = async (addressData: { [key: string]: any }) => {
  try {
    const { data } = await client.mutate({
      mutation: VERIFY_ADDRESS,
      variables: { address: addressData },
      context: {
        headers: getAuthHeaders(),
      },
    });

    if (!data.verifyAddress.isValid) {
      throw new Error(
        data.verifyAddress.message || "Address validation failed"
      );
    }

    return data.verifyAddress;
  } catch (error) {
    console.error("Address verification error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Address verification failed");
    }
    throw new Error("Address verification failed");
  }
};

export const createOrder = async (orderData: { [key: string]: any }) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_ORDER,
      variables: { orderData },
      context: {
        headers: getAuthHeaders(),
      },
    });

    return data.createOrder;
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to create order");
    }
    throw new Error("Failed to create order");
  }
};

export const processPayment = async (paymentData: { [key: string]: any }) => {
  try {
    const { data } = await client.mutate({
      mutation: PROCESS_PAYMENT,
      variables: { paymentData },
      context: {
        headers: getAuthHeaders(),
      },
    });

    if (!data.processPayment.success) {
      throw new Error(
        data.processPayment.message || "Payment processing failed"
      );
    }

    return data.processPayment;
  } catch (error) {
    console.error("Payment processing error:", error);

    if (
      error instanceof Error &&
      "graphQLErrors" in error &&
      Array.isArray((error as any).graphQLErrors)
    ) {
      const paymentDeclined = (error as any).graphQLErrors.find(
        (e: any) => e.extensions?.code === "PAYMENT_DECLINED"
      );

      if (paymentDeclined) {
        throw new Error(
          "Payment declined. Please check your payment details and try again."
        );
      }

      const rateLimit = (error as any).graphQLErrors.find(
        (e: any) => e.extensions?.code === "RATE_LIMIT_EXCEEDED"
      );

      if (rateLimit) {
        throw new Error(
          "Too many payment attempts. Please wait a moment and try again."
        );
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message || "Payment processing failed");
    }
    throw new Error("Payment processing failed");
  }
};

export const getShippingMethods = async (
  address: { [key: string]: any },
  items: Array<any>
) => {
  try {
    const { data } = await client.query({
      query: GET_SHIPPING_METHODS,
      variables: { address, items },
      context: {
        headers: getAuthHeaders(),
      },
      fetchPolicy: "network-only",
    });

    return data.shippingMethods;
  } catch (error) {
    console.error("Shipping methods error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch shipping methods");
    }
    throw new Error("Failed to fetch shipping methods");
  }
};

export const applyPromoCode = async (code: string, items: Array<any>) => {
  try {
    const { data } = await client.mutate({
      mutation: APPLY_PROMO_CODE,
      variables: { code, items },
      context: {
        headers: getAuthHeaders(),
      },
    });

    return data.applyPromoCode;
  } catch (error) {
    console.error("Promo code error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to apply promo code");
    }
    throw new Error("Failed to apply promo code");
  }
};
