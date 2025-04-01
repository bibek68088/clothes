// api/authLinks.js - Apollo Links for authentication and token refresh

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, InMemoryCache, Observable } from "@apollo/client";
import { getAuthToken, storeAuthToken } from "../utils/auth";
import { refreshTokenMutation } from "./mutations";

/**
 * Auth link to attach JWT to outgoing requests
 */
export const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/**
 * Refreshes the JWT token if it's about to expire
 * @returns {Promise<string>} - Promise resolving to the new token
 */
export const refreshToken = async () => {
  try {
    // Create a new client without auth links to avoid circular dependencies
    const tempClient = new ApolloClient({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/graphql",
      cache: new InMemoryCache(),
    });

    const { data } = await tempClient.mutate({
      mutation: refreshTokenMutation,
      context: {
        headers: {
          authorization: `Bearer ${getAuthToken()}`,
        },
      },
    });

    // Store the new token
    if (data.refreshToken.token) {
      storeAuthToken(data.refreshToken.token);
    }

    return data.refreshToken.token;
  } catch (error) {
    console.error("Token refresh error:", error);
    // If token refresh fails, user may need to log in again
    throw new Error("Your session has expired. Please log in again.");
  }
};

/**
 * Error handling link for token refresh on authentication errors
 */
export const errorLink = onError(
  ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        // If we get an UNAUTHENTICATED error, try to refresh the token
        if (err.extensions?.code === "UNAUTHENTICATED") {
          return new Observable((observer) => {
            // Attempt to refresh auth token
            refreshToken()
              .then((newToken) => {
                // Retry the failed request with new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newToken}`,
                  },
                });
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              })
              .catch((error) => {
                // Token refresh failed, observer error
                observer.error(error);
              });
          });
        }
      }
    }
  }
);
