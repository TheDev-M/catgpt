import { useEffect, useRef, useState } from "react";
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

      setTimeout(spawn, FALL_DURATION + randomInt(MIN_INTERVAL, MAX_INTERVAL));
    };

    const timeoutId = setTimeout(spawn, randomInt(MIN_INTERVAL, MAX_INTERVAL));
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

  return {
    falling,
    lastCaught,
    handleCatch,
    clearLastCaught: () => setLastCaught(null)
  };
}
