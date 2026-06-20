import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/apiClient.js";

const WAKEUP_THRESHOLD_MS = 1500;
const AWAKE_DISPLAY_MS = 2000;

export function useServerWakeup() {
  const [status, setStatus] = useState("idle"); // "idle" | "waking" | "awake" | "done"

  useEffect(() => {
    let cancelled = false;

    const threshold = setTimeout(() => {
      if (!cancelled) setStatus("waking");
    }, WAKEUP_THRESHOLD_MS);

    fetch(`${API_BASE_URL}/actuator/health`)
      .finally(() => {
        clearTimeout(threshold);
        if (!cancelled) {
          setStatus((prev) => {
            if (prev === "waking") {
              setTimeout(() => {
                if (!cancelled) setStatus("done");
              }, AWAKE_DISPLAY_MS);
              return "awake";
            }
            return "done";
          });
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(threshold);
    };
  }, []);

  return status;
}
