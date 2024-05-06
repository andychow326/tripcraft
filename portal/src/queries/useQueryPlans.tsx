import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { PlanMultipleResponse } from "../../generated";
import { AxiosError } from "axios";
import { ApiError } from "../models/api";
import { useContext } from "react";
import { ApiClientContext } from "../providers/ApiClientProvider";

const useQueryPlans = (): UseQueryResult<
  PlanMultipleResponse,
  AxiosError<ApiError>
> => {
  const queryKey = ["QueryPlans"];
  const { apiClient } = useContext(ApiClientContext);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiClient.plan.planGet();
      return res.data;
    },
  });
};

export default useQueryPlans;
