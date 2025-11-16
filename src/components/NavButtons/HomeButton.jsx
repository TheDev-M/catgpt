import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="btn btn-primary rounded-full w-14 h-14 shadow-lg text-2xl transition-transform hover:scale-110"
      title="Back to Home"
    >
      🐾
    </button>
  );
}
