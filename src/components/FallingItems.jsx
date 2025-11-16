import { GAME_CONFIG} from "@/config/gameConfig.js";
import { ITEM_DROPS } from "@/constants/itemDrops.js";

import { useEffect, useRef, useState } from "react";

import { increaseItemAmountByName } from "@/services/itemsApi.js";
import ItemPopup from "@/components/ItemPopup.jsx";

const FALL_DURATION = GAME_CONFIG.fallingItems.fallDuration;
const MIN_INTERVAL = GAME_CONFIG.fallingItems.minInterval;
const MAX_INTERVAL = GAME_CONFIG.fallingItems.maxInterval;

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

export default function FallingItems({ reloadInventory }) {
  const [falling, setFalling] = useState(null);
  const [lastCaught, setLastCaught] = useState(null);
  const keyRef = useRef(0);

  useEffect(() => {
    let timeoutId;

    const spawn = () => {
      const random = ITEM_DROPS[Math.floor(Math.random() * ITEM_DROPS.length)];
      keyRef.current += 1;

      setFalling({
        key: keyRef.current,
        name: random.name,
        icon: random.icon,
        top: -70,
        left: rand(20, window.innerWidth - 80)
      });

      timeoutId = setTimeout(
        spawn,
        FALL_DURATION + rand(MIN_INTERVAL, MAX_INTERVAL)
      );
    };

    timeoutId = setTimeout(spawn, rand(MIN_INTERVAL, MAX_INTERVAL));
    return () => clearTimeout(timeoutId);
  }, []);

  async function handleCatch() {
    if (!falling) return;

    try {
      await increaseItemAmountByName(falling.name);
      setLastCaught({ name: falling.name, icon: falling.icon });
      setFalling(null);

      reloadInventory?.({ background: true });
    } catch (e) {
      console.error("Failed to increase item amount", e);
    }
  }

  return (
    <>
      {falling && (
        <div
          key={falling.key}
          className="fixed z-1200 w-14 h-14 cursor-pointer bg-no-repeat bg-contain pointer-events-auto"
          style={{
            top: `${falling.top}px`,
            left: `${falling.left}px`,
            backgroundImage: `url(${falling.icon})`,
            animation: `fallItem ${FALL_DURATION}ms linear forwards`
          }}
          onClick={handleCatch}
        />
      )}

      <style>{`
        @keyframes fallItem {
        from { top: -100px; }
        to   { top: 120vh; }
        }
      `}</style>

      {lastCaught && (
        <ItemPopup
          icon={lastCaught.icon}
          name={lastCaught.name}
          onClose={() => setLastCaught(null)}
        />
      )}
    </>
  );
}
