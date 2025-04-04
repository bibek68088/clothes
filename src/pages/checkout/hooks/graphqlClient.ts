// api/graphqlClient.js - Apollo Client configuration

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { authLink, errorLink } from "../../../components/auth/authLink";

// Create the HTTP link for your GraphQL endpoint
const API_URL =
  import.meta.env.VITE_AASHISH_API_URL || "http://localhost:3000/api";

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
});

// Combine the auth links with the HTTP link
const link = errorLink.concat(authLink.concat(httpLink));

// Create and export the Apollo Client instance
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});
