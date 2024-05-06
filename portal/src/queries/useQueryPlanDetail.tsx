import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { PlanSingleResponse } from "../../generated";
import { AxiosError } from "axios";
import { ApiError } from "../models/api";
import { useContext } from "react";
import { ApiClientContext } from "../providers/ApiClientProvider";

const useQueryPlanDetail = (
  planId: string,
): UseQueryResult<PlanSingleResponse, AxiosError<ApiError>> => {
  const { apiClient } = useContext(ApiClientContext);
  const queryKey = ["QueryPlanDetail", planId];
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiClient.plan.planIdGet(planId);
      return res.data;
    },
  });
};

export default useQueryPlanDetail;
