import { useNavigate } from "react-router-dom";

export default function CatDetailsButton({ id }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/catbox/${id}`)}
      className="btn btn-primary btn-sm rounded-full px-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-[1px]"
      title="View cat details"
    >
      View
    </button>
  );
}
