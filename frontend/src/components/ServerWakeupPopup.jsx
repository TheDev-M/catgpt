export default function ServerWakeupPopup({ status }) {
  if (status === "idle" || status === "done") return null;

  const awake = status === "awake";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`
          relative z-10 flex flex-col items-center gap-4
          bg-base-200 border border-base-300 rounded-2xl shadow-2xl
          px-10 py-8 max-w-sm w-full mx-4
          transition-all duration-500
          ${awake ? "scale-105" : "scale-100"}
        `}
      >
        {awake ? (
          <>
            <span className="text-5xl">🐱</span>
            <p className="text-lg font-semibold text-success">Server is awake!</p>
            <p className="text-sm opacity-60 text-center">Loading your cats…</p>
          </>
        ) : (
          <>
            <span className="text-5xl">🐱</span>
            <p className="text-lg font-semibold">Waking up the server…</p>
            <p className="text-sm opacity-60 text-center">
              The server was sleeping on the free tier.
              <br />
              This usually takes 30–60 seconds.
            </p>
            <span className="loading loading-dots loading-md mt-1" />
          </>
        )}
      </div>
    </div>
  );
}
