
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { authLink, errorLink } from "../../../components/auth/authLink";

const API_URL =
  import.meta.env.VITE_AASHISH_API_URL || "http://localhost:3000/api";

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
});

const link = errorLink.concat(authLink.concat(httpLink));

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
