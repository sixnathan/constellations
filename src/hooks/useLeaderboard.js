import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useLeaderboard(category) {
  const data = useQuery(api.leaderboard.getLeaderboard, { category });
  return {
    entries: data ?? [],
    isLoading: data === undefined,
  };
}
