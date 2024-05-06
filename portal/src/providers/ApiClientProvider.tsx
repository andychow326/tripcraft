import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Configuration, AuthApi, PlanApi, WorldApi } from "../../generated";
import { AppConfig } from "../config";
import { AuthContext } from "./AuthProvider";

interface ApiClient {
  auth: AuthApi;
  plan: PlanApi;
  world: WorldApi;
}

interface ApiClientContextValue {
  apiClient: ApiClient;
}

export const ApiClientContext = React.createContext<ApiClientContextValue>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);

const ApiClientProvider = ({ children }: PropsWithChildren): ReactElement => {
  const queryClient = useQueryClient();
  const authContextValue = useContext(AuthContext);

  const apiClient = useMemo(() => {
    const config = new Configuration({
      basePath: AppConfig.api.endpoint,
      baseOptions: {
        headers: {
          Authorization: authContextValue.isAuthenticated
            ? `Bearer ${authContextValue.accessToken}`
            : undefined,
        },
      },
    });

    return {
      auth: new AuthApi(config),
      plan: new PlanApi(config),
      world: new WorldApi(config),
    };
  }, [authContextValue]);

  useLayoutEffect(() => {
    queryClient.resetQueries().then(null).catch(console.error);
  }, [queryClient]);

  const contextValue = useMemo(
    (): ApiClientContextValue => ({
      apiClient,
    }),
    [apiClient],
  );

  return (
    <ApiClientContext.Provider value={contextValue}>
      {children}
    </ApiClientContext.Provider>
  );
};

export default ApiClientProvider;
