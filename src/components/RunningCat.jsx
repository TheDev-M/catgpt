import { GAME_CONFIG} from "@/config/gameConfig.js";

import { useEffect, useRef, useState } from "react";
import CaughtCatPopup from "@/components/CaughtCatPopup/CaughtCatPopup.jsx";

const RUN_DURATION = GAME_CONFIG.runningCat.runDuration;
const MIN_INTERVAL = GAME_CONFIG.runningCat.minInterval;
const MAX_INTERVAL = GAME_CONFIG.runningCat.maxInterval;

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

export default function RunningCat() {
  const [cat, setCat] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const keyRef = useRef(0);

  useEffect(() => {
    let timeout;

    const spawn = () => {
      if (!showPopup) {
        keyRef.current += 1;

        setCat({
          key: keyRef.current,
          top: rand(0, window.innerHeight - 120),
          fromLeft: Math.random() < 0.5
        });
      }

      timeout = setTimeout(
        spawn,
        RUN_DURATION + rand(MIN_INTERVAL, MAX_INTERVAL)
      );
    };

    timeout = setTimeout(spawn, rand(MIN_INTERVAL, MAX_INTERVAL));
    return () => clearTimeout(timeout);
  }, [showPopup]);

  const handleClick = () => {
    setCat(null);
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
          key={cat.key}
          className="pointer-events-auto fixed z-1500 h-[100px] w-[150px] cursor-pointer bg-no-repeat bg-cover"
          style={{
            top: `${cat.top}px`,
            backgroundImage: 'url("/imgs/RunningCat.gif")',
            transform: cat.fromLeft ? "none" : "scaleX(-1)",
            animation: `${
              cat.fromLeft ? "runRight" : "runLeft"
            } ${RUN_DURATION}ms linear forwards`,
            willChange: "left"
          }}
          onMouseDown={handleClick}
        />
      )}

      {showPopup && <CaughtCatPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
