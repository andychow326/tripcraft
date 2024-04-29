import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface AppQueryClientProviderProps extends PropsWithChildren {
  queryClient?: QueryClient;
}

const AppQueryClientProvider = (
  props: AppQueryClientProviderProps,
): React.ReactElement => {
  const { queryClient = defaultQueryClient, children } = props;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default AppQueryClientProvider;
