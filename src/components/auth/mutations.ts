import { gql } from "@apollo/client";

export const VERIFY_ADDRESS = gql`
  mutation VerifyAddress($address: AddressInput!) {
    verifyAddress(address: $address) {
      isValid
      suggestions {
        street
        city
        state
        zipCode
        country
      }
      message
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($orderData: OrderInput!) {
    createOrder(orderData: $orderData) {
      orderId
      paypalOrderId
      status
      createdAt
      total
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($paymentData: PaymentInput!) {
    processPayment(paymentData: $paymentData) {
      success
      transactionId
      status
      message
    }
  }
`;

export const APPLY_PROMO_CODE = gql`
  mutation ApplyPromoCode($code: String!, $items: [CartItemInput!]!) {
    applyPromoCode(code: $code, items: $items) {
      valid
      discount
      message
      discountType
      affectedItems
    }
  }
`;

export const refreshTokenMutation = gql`
  mutation RefreshToken {
    refreshToken {
      token
      expiresAt
    }
  }
`;