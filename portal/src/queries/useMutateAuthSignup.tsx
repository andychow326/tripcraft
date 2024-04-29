import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext } from "react";
import { AxiosError } from "axios";
import { SignupRequest, SignupResponse } from "../../generated";
import { ApiClientContext } from "../providers/ApiClientProvider";
import { ApiError } from "../models/api";

const useMutateAuthSignup = (): UseMutationResult<
  SignupResponse,
  AxiosError<ApiError>,
  SignupRequest
> => {
  const mutationKey = "MutateAuthSignup";
  const { apiClient } = useContext(ApiClientContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (request: SignupRequest): Promise<SignupResponse> => {
      const res = await apiClient.auth.authSignupPost(request);
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

export default useMutateAuthSignup;
