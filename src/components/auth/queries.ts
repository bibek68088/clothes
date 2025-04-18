import { gql } from "@apollo/client";

export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods($address: AddressInput!, $items: [CartItemInput!]!) {
    shippingMethods(address: $address, items: $items) {
      id
      name
      description
      price
      estimatedDelivery
      isAvailable
    }
  }
`;