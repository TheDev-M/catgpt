export const GAME_CONFIG = {
  runningCat: {
    runDuration: Number(process.env.RUN_DURATION_MS) || 4000,
    minInterval: Number(process.env.RUN_MIN_INTERVAL_MS) || 2 * 60 * 1000,
    maxInterval: Number(process.env.RUN_MAX_INTERVAL_MS) || 5 * 60 * 1000
  },

  fallingItems: {
    fallDuration: Number(process.env.FALL_DURATION_MS) || 5000,
    minInterval: Number(process.env.FALL_MIN_INTERVAL_MS) || 10000,
    maxInterval: Number(process.env.FALL_MAX_INTERVAL_MS) || 20000
  },

  decay: {
    hungerInterval: Number(process.env.HUNGER_INTERVAL_MS) || 60 * 1000
  }
};
