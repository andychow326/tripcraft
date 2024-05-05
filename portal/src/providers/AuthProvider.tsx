import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { User } from "../models/user";
import { jwtDecode } from "jwt-decode";

type AuthContextValueCommon = {
  authenticate: (accessToken: string) => void;
  logout: () => void;
};

type AuthContextValueAuthenticated = {
  isAuthenticated: true;
  accessToken: string;
  user: User;
};

type AuthContextValueUnAuthenticated = {
  isAuthenticated: false;
};

type AuthContextValue = AuthContextValueCommon &
  (AuthContextValueAuthenticated | AuthContextValueUnAuthenticated);

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    window.localStorage.getItem("accessToken"),
  );

  const authenticate = useCallback((token: string) => {
    window.localStorage.setItem("accessToken", token);
    setAccessToken(token);
    window.location.reload();
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("accessToken");
    setAccessToken(null);
    window.location.reload();
  }, []);

  const value = useMemo((): AuthContextValue => {
    const common = { authenticate, logout };

    if (accessToken == null) {
      return { ...common, isAuthenticated: false };
    }

    const user = jwtDecode(accessToken) as User;
    return {
      ...common,
      isAuthenticated: true,
      accessToken: accessToken,
      user: user,
    };
  }, [accessToken, authenticate, logout]);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
