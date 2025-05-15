import {  useQuery  } from "@tanstack/react-query"
import { getRatities } from "@/utils/api"

export const useRarities = () => {
  const { isLoading, error: isError, data, isFetching } = useQuery({
    queryKey: ['rarities'],
    staleTime: 5 * (60 * 1000),
    queryFn: () =>
      getRatities().then(res => {
        return res.data;
      }),
    refetchOnWindowFocus: true,
    retry: 3,
  });



  return {
    rarities: data,
    isLoading,
    error:isError,
  }
}