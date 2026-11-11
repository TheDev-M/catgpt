import { useCallback, useEffect, useRef, useState } from "react";
import { randomInt, randomItem } from "@/utils/random.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";
import { ITEM_DROPS } from "@/constants/itemDrops.js";
import { increaseItemAmountByName } from "@/services/itemsApi.js";

const FALL_DURATION = GAME_CONFIG.fallingItems.fallDuration;
const MIN_INTERVAL = GAME_CONFIG.fallingItems.minInterval;
const MAX_INTERVAL = GAME_CONFIG.fallingItems.maxInterval;

export function useFallingItems(onItemCaught) {
  const [falling, setFalling] = useState(null);
  const [lastCaught, setLastCaught] = useState(null);
  const keyRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const spawn = () => {
      const item = randomItem(ITEM_DROPS);
      keyRef.current += 1;

      setFalling({
        key: keyRef.current,
        name: item.name,
        icon: item.icon,
        top: -70,
        left: randomInt(20, window.innerWidth - 80)
      });

      // Each spawn schedules the next one, so the id has to live in a ref —
      // a local would leave every timeout after the first uncancellable, and
      // items would keep spawning (and setting state) after unmount.
      timeoutRef.current = setTimeout(spawn, FALL_DURATION + randomInt(MIN_INTERVAL, MAX_INTERVAL));
    };

    timeoutRef.current = setTimeout(spawn, randomInt(MIN_INTERVAL, MAX_INTERVAL));

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleCatch = useCallback(async () => {
    let caught;
    setFalling((current) => {
      caught = current;
      return null;
    });

    if (!caught) return;

    try {
      await increaseItemAmountByName(caught.name);
      setLastCaught({ name: caught.name, icon: caught.icon });
      onItemCaught?.();
    } catch (e) {
      console.error("Failed to increase item amount", e);
    }
  }, [onItemCaught]);

  const clearLastCaught = useCallback(() => setLastCaught(null), []);

  return { falling, lastCaught, handleCatch, clearLastCaught };
}
