import { useEffect, useRef, useState } from "react";
import { randomInt, randomItem } from "@/utils/random.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";
import { ITEM_DROPS } from "@/constants/itemDrops.js";
import { increaseItemAmountByName } from "@/services/itemsApi.js";

const FALL_DURATION = GAME_CONFIG.fallingItems.fallDuration;
const MIN_INTERVAL = GAME_CONFIG.fallingItems.minInterval;
const MAX_INTERVAL = GAME_CONFIG.fallingItems.maxInterval;

/**
 * Custom hook to manage falling items animation and catching
 * Handles automatic spawning, catching, and inventory updates
 * 
 * @param {Function} onItemCaught - Callback when item is successfully caught
 * @returns {Object} Current falling item, last caught item, and catch handler
 */
export function useFallingItems(onItemCaught) {
  const [falling, setFalling] = useState(null);
  const [lastCaught, setLastCaught] = useState(null);
  const keyRef = useRef(0);

  // Spawn items at random intervals
  useEffect(() => {
    let timeoutId;

    const spawn = () => {
      const randomDrop = randomItem(ITEM_DROPS);
      keyRef.current += 1;

      setFalling({
        key: keyRef.current,
        name: randomDrop.name,
        icon: randomDrop.icon,
        top: -70,
        left: randomInt(20, window.innerWidth - 80),
      });

      timeoutId = setTimeout(
        spawn,
        FALL_DURATION + randomInt(MIN_INTERVAL, MAX_INTERVAL)
      );
    };

    timeoutId = setTimeout(spawn, randomInt(MIN_INTERVAL, MAX_INTERVAL));
    return () => clearTimeout(timeoutId);
  }, []);

  const handleCatch = async () => {
    if (!falling) return;

    const caught = falling;
    setFalling(null);

    try {
      await increaseItemAmountByName(caught.name);
      setLastCaught({ name: caught.name, icon: caught.icon });
      onItemCaught?.();
    } catch (e) {
      console.error("Failed to increase item amount", e);
    }
  };

  const clearLastCaught = () => {
    setLastCaught(null);
  };

  return {
    falling,
    lastCaught,
    handleCatch,
    clearLastCaught,
  };
}
