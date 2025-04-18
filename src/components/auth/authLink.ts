import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, InMemoryCache, Observable } from "@apollo/client";
import { getAuthToken, storeAuthToken } from "../utils/auth";
import { refreshTokenMutation } from "./mutations";

export const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});


export const refreshToken = async () => {
  try {
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

    if (data.refreshToken.token) {
      storeAuthToken(data.refreshToken.token);
    }

    return data.refreshToken.token;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw new Error("Your session has expired. Please log in again.");
  }
};


export const errorLink = onError(
  ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions?.code === "UNAUTHENTICATED") {
          return new Observable((observer) => {
            refreshToken()
              .then((newToken) => {
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
                observer.error(error);
              });
          });
        }
      }
    }
  }
);
