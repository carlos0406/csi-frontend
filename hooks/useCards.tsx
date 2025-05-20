import { useQuery } from "@tanstack/react-query";
import { getCards } from "@/utils/api";
import { useState } from "react";

export const useCards = () => {
  const [query, setQuery] = useState<string>("");
  const {
    isLoading,
    error: isError,
    data,
    isFetching,
  } = useQuery({
    queryKey: ["cards", query],
    staleTime: 5 * (60 * 1000),
    queryFn: async () => {
      if (!query || query.length < 5) {
        return [];
      }
      const { data } = await getCards(query);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });
  return {
    cards: data,
    isLoading,
    error: isError,
    setCardQuery: setQuery,
  };
};
