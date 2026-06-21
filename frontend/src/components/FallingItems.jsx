import { useFallingItems } from "@/hooks/useFallingItems.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";
import ItemPopup from "@/components/ItemPopup.jsx";

const FALL_DURATION = GAME_CONFIG.fallingItems.fallDuration;

export default function FallingItems({ onItemCaught }) {
  const { falling, lastCaught, handleCatch, clearLastCaught } =
    useFallingItems(onItemCaught);

  return (
    <>
      {falling && (
        <div
          id="falling-item"
          key={falling.key}
          className="fixed z-1200 w-14 h-14 cursor-pointer bg-no-repeat bg-contain pointer-events-auto"
          style={{
            top: `${falling.top}px`,
            left: `${falling.left}px`,
            backgroundImage: `url(${falling.icon})`,
            animation: `fallItem ${FALL_DURATION}ms linear forwards`
          }}
          onMouseDown={handleCatch}
          data-item-name={falling.name}
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
          onClose={clearLastCaught}
        />
      )}
    </>
  );
}
