import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";
import { getSessionId } from "../lib/playerId.js";

export function usePlayer() {
  const sessionId = getSessionId();
  const player = useQuery(api.players.getPlayer, { sessionId });
  const getOrCreate = useMutation(api.players.getOrCreatePlayer);
  const updateName = useMutation(api.players.updateDisplayName);
  const initRef = useRef(false);

  useEffect(() => {
    if (player === undefined && !initRef.current) {
      initRef.current = true;
      getOrCreate({ sessionId }).catch(() => {
        initRef.current = false;
      });
    }
  }, [player, sessionId, getOrCreate]);

  const setDisplayName = useCallback(
    (name) => {
      updateName({ sessionId, displayName: name }).catch(() => {});
    },
    [sessionId, updateName],
  );

  return {
    player: player ?? null,
    sessionId,
    setDisplayName,
    isLoading: player === undefined,
  };
}
