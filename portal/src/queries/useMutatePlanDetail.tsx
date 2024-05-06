import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PlanRequest, PlanSingleResponse } from "../../generated";
import { AxiosError } from "axios";
import { ApiError } from "../models/api";
import { useContext } from "react";
import { ApiClientContext } from "../providers/ApiClientProvider";

const useMutatePlanDetail = (
  planId: string,
): UseMutationResult<PlanSingleResponse, AxiosError<ApiError>, PlanRequest> => {
  const mutationKey = ["MutatePlanDetail", planId];
  const { apiClient } = useContext(ApiClientContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKey,
    mutationFn: async (request: PlanRequest): Promise<PlanSingleResponse> => {
      const res = await apiClient.plan.planIdPut(planId, request);
      return res.data;
    },
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: mutationKey,
      });
    },
  });
};

export default useMutatePlanDetail;
