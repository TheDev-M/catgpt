import { useNavigate } from "react-router-dom";

export default function CatBoxButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Go to Cat Box"
      title="Cat Box"
      onClick={() => navigate("/catbox")}
      className="btn btn-primary rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110 p-0"
    >
      <img
        src="/imgs/catbox.png"
        alt="Cat Box"
        draggable="false"
        className="w-full h-full object-contain select-none scale-120 -translate-y-1"
      />
    </button>
  );
}
