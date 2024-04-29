import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext } from "react";
import { AxiosError } from "axios";
import { LoginRequest, LoginResponse } from "../../generated";
import { ApiClientContext } from "../providers/ApiClientProvider";
import { ApiError } from "../models/api";

const useMutateAuthLogin = (): UseMutationResult<
  LoginResponse,
  AxiosError<ApiError>,
  LoginRequest
> => {
  const mutationKey = "MutateAuthLogin";
  const { apiClient } = useContext(ApiClientContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (request: LoginRequest): Promise<LoginResponse> => {
      const res = await apiClient.auth.authLoginPost(request);
      return res.data;
    },
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [mutationKey],
      });
    },
  });
};

export default useMutateAuthLogin;
