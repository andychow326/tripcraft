import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiClientContext } from "../providers/ApiClientProvider";

const useQueryWorldState = (query: string) => {
  const { apiClient } = useContext(ApiClientContext);
  const queryKey = ["QueryWorld", query];
  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (query == null || query === "") {
        return { totalCount: 0, nextPageIndex: null, results: [] };
      }
      const res = await apiClient.world.worldStateGet(
        query,
        undefined,
        undefined,
        pageParam,
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageIndex,
  });
};

export default useQueryWorldState;
