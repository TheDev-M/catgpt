import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";
import CatDetailsButton from "@/components/NavButtons/CatDetailsButton.jsx";
import SelectedBadge from "@/components/Badges/SelectedBadge.jsx";

export default function CatCard({ cat }) {
  const { selectedCatId } = useSelectedCat();
  const { id, name, image } = cat || {};
  const isSelected = String(id) === String(selectedCatId);

  return (
    <div 
      id={`cat-card-${id}`}
      className="card bg-base-200 shadow-lg rounded-2xl overflow-hidden relative transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
      data-cat-id={id}
      data-cat-name={name}
    >
      {/* Badge */}
      {isSelected && <SelectedBadge />}

      <div className="relative w-full h-72 bg-base-300 rounded-t-2xl p-3">
        {image ? (
          <div className="relative w-full h-full overflow-hidden rounded-xl border-[6px] border-base-100 shadow-md">
            <img
              id={`cat-image-${id}`}
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center select-none scale-105"
              draggable="false"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="grid place-items-center w-full h-full text-sm opacity-60 italic">
            No image
          </div>
        )}
      </div>

      <div className="card-body px-4 py-3 flex flex-col gap-3">
        <h3 id={`cat-name-${id}`} className="card-title text-lg font-semibold truncate">{name}</h3>

        <div className="flex justify-end">
          <CatDetailsButton id={id} />
        </div>
      </div>
    </div>
  );
}
