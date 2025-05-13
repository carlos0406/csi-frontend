import {  useQuery  } from "@tanstack/react-query"
import { getPurchases } from "@/utils/api"

export const usePurchases = () => {
  const { isLoading, error: isError, data, isFetching } = useQuery({
    queryKey: ['purchase', ],
    staleTime: 5 * (60 * 1000),
    queryFn: () =>
      getPurchases({limit:9999}).then(res => {
        return res.data;
      }),
    refetchOnWindowFocus: true,
    retry: 3,
  });



  return {
    purchases: data,
    isLoading,
    error:isError,
  }
}