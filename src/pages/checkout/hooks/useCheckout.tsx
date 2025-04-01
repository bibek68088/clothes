// api/checkout.js - GraphQL API functions for the checkout process

import { client } from "./graphqlClient";
import { getAuthHeaders } from "../../../components/utils/auth";
import {
  VERIFY_ADDRESS,
  CREATE_ORDER,
  PROCESS_PAYMENT,
  APPLY_PROMO_CODE
} from "../../../components/auth/mutations";
import { GET_SHIPPING_METHODS } from "../../../components/auth/queries";

/**
 * Verifies a shipping address for validity
 * @param {Object} addressData - The address data to verify
 * @returns {Promise<Object>} - Promise resolving to the verification results
 */
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

/**
 * Creates a new order in the system
 * @param {Object} orderData - Complete order information including items and shipping details
 * @returns {Promise<Object>} - Promise resolving to the created order information
 */
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

/**
 * Processes a payment for an existing order
 * @param {Object} paymentData - Payment details including orderId and method
 * @returns {Promise<Object>} - Promise resolving to payment confirmation
 */
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

    // Handle specific error types
    if (error instanceof Error && 'graphQLErrors' in error && Array.isArray((error as any).graphQLErrors)) {
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

/**
 * Gets available shipping methods based on address and cart items
 * @param {Object} address - Shipping address
 * @param {Array} items - Cart items
 * @returns {Promise<Array>} - Promise resolving to available shipping methods
 */
export const getShippingMethods = async (address: { [key: string]: any }, items: Array<any>) => {
  try {
    const { data } = await client.query({
      query: GET_SHIPPING_METHODS,
      variables: { address, items },
      context: {
        headers: getAuthHeaders(),
      },
      // Don't cache shipping methods as they may change based on inventory
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

/**
 * Applies a promo code to the current order
 * @param {string} code - The promo code to apply
 * @param {Array} items - The current cart items
 * @returns {Promise<Object>} - Promise resolving to discount information
 */
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