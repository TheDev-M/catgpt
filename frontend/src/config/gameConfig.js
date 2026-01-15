export const GAME_CONFIG = {
  runningCat: {
    runDuration: Number(import.meta.env.VITE_RUN_DURATION_MS) || 4000,
    minInterval:
      Number(import.meta.env.VITE_RUN_MIN_INTERVAL_MS) || 2 * 60 * 1000,
    maxInterval:
      Number(import.meta.env.VITE_RUN_MAX_INTERVAL_MS) || 5 * 60 * 1000
  },

  fallingItems: {
    fallDuration: Number(import.meta.env.VITE_FALL_DURATION_MS) || 5000,
    minInterval: Number(import.meta.env.VITE_FALL_MIN_INTERVAL_MS) || 10000,
    maxInterval: Number(import.meta.env.VITE_FALL_MAX_INTERVAL_MS) || 20000
  },

  decay: {
    hungerInterval: Number(import.meta.env.HUNGER_INTERVAL_MS) || 60 * 1000
  }
};
