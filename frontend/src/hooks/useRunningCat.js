import { useEffect, useRef, useState } from "react";
import { randomInt, randomBoolean } from "@/utils/random.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";

const RUN_DURATION = GAME_CONFIG.runningCat.runDuration;
const MIN_INTERVAL = GAME_CONFIG.runningCat.minInterval;
const MAX_INTERVAL = GAME_CONFIG.runningCat.maxInterval;

/**
 * Custom hook to manage the running cat animation and spawning
 * Handles automatic spawning at random intervals and cleanup
 * 
 * @param {boolean} isPaused - Whether spawning is paused (e.g., when popup is open)
 * @returns {Object} Current cat state and click handler
 */
export function useRunningCat(isPaused = false) {
  const [cat, setCat] = useState(null);
  const keyRef = useRef(0);

  useEffect(() => {
    let timeout;

    const spawn = () => {
      if (!isPaused) {
        keyRef.current += 1;

        setCat({
          key: keyRef.current,
          top: randomInt(0, window.innerHeight - 120),
          fromLeft: randomBoolean(),
        });
      }

      timeout = setTimeout(
        spawn,
        RUN_DURATION + randomInt(MIN_INTERVAL, MAX_INTERVAL)
      );
    };

    timeout = setTimeout(spawn, randomInt(MIN_INTERVAL, MAX_INTERVAL));
    return () => clearTimeout(timeout);
  }, [isPaused]);

  const handleClick = () => {
    setCat(null);
  };

  return {
    cat,
    handleClick,
  };
}
