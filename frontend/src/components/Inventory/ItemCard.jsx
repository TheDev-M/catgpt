import {ITEM_ICONS} from "@/constants/itemDrops.js";

const categoryStyles = {
  FOOD: {
    badge: "bg-green-100 text-green-700 border-green-500"
  },
  HYGIENE: {
    badge: "bg-rose-100 text-rose-700 border-rose-500"
  },
  TOY: {
    badge: "bg-amber-100 text-amber-700 border-amber-500"
  },
  default: {
    badge: "bg-gray-100 text-gray-700 border-gray-500"
  }
};

export default function ItemCard({ item, loading, onUse }) {
  const { id, name, category, availableAmount = 0, effect } = item || {};
  const icon = ITEM_ICONS[name];

  const style = categoryStyles[category] ?? categoryStyles.default;

  return (
    <div 
      id={`item-card-${id}`}
      className="card bg-base-200 shadow-md rounded-2xl overflow-hidden"
      data-item-id={id}
      data-item-name={name}
    >
      <div className="card-body p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 id={`item-name-${id}`} className="font-semibold text-sm truncate">{name}</h3>

          <span
            id={`item-category-${id}`}
            className={`badge badge-xs border ${style.badge} whitespace-nowrap`}
          >
            {category
              ? category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase()
              : "—"}
          </span>
        </div>

        <div className="mx-auto my-1 rounded-2xl p-2 ring-2 ring-base-300/40 bg-base-100 shadow">
          {icon ? (
            <img
              id={`item-icon-${id}`}
              src={icon}
              alt={name}
              className="w-14 h-14 object-contain select-none"
              draggable="false"
              loading="lazy"
            />
          ) : (
            <div className="w-14 h-14 grid place-items-center opacity-60 italic text-xs">
              No icon
            </div>
          )}
        </div>

        <p id={`item-effect-${id}`} className="text-xs opacity-80 text-center">
          {effect?.stat ? (
            <>
              <strong className="uppercase tracking-wide">
                {String(effect.stat)}
              </strong>
              &nbsp;+{effect.amount ?? 0}
            </>
          ) : (
            "—"
          )}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span id={`item-amount-${id}`} className="text-xs opacity-70">
            Available: {availableAmount}
          </span>

          <button
            id={`item-use-button-${id}`}
            onClick={onUse}
            disabled={loading || availableAmount <= 0}
            className="btn btn-primary btn-xs"
            data-item-id={id}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Use"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
