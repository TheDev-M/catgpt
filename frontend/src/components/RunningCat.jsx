import { useState } from "react";
import { useRunningCat } from "@/hooks/useRunningCat.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";
import CaughtCatPopup from "@/components/CaughtCatPopup/CaughtCatPopup.jsx";

const RUN_DURATION = GAME_CONFIG.runningCat.runDuration;

export default function RunningCat() {
  const [showPopup, setShowPopup] = useState(false);
  const { cat, handleClick } = useRunningCat(showPopup);

  const onCatClick = () => {
    handleClick();
    setShowPopup(true);
  };

  return (
    <>
      <style>{`
        @keyframes runRight { 
          0% { left: -150px; } 
          100% { left: 100vw; } 
        }
        @keyframes runLeft {  
          0% { left: 100vw; } 
          100% { left: -150px; } 
        }
      `}</style>

      {cat && (
        <div
          id="running-cat"
          key={cat.key}
          className="pointer-events-auto fixed z-1500 h-[100px] w-[150px] cursor-pointer bg-no-repeat bg-cover"
          style={{
            top: `${cat.top}px`,
            backgroundImage: 'url("/imgs/RunningCat.gif")',
            transform: cat.fromLeft ? "none" : "scaleX(-1)",
            animation: `${
              cat.fromLeft ? "runRight" : "runLeft"
            } ${RUN_DURATION}ms linear forwards`,
            willChange: "left",
          }}
          onMouseDown={onCatClick}
        />
      )}

      {showPopup && <CaughtCatPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
