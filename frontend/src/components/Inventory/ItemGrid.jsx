import { sortItems } from "@/utils/sorting.js";
import ItemCard from "./ItemCard.jsx";

export default function ItemGrid({ items = [], usingId, onUse }) {
  const sorted = sortItems(items);
  
  return (
    <div className="grid gap-4">
      {sorted.map((item) => (
        <ItemCard
          key={item.id ?? item.name}
          item={item}
          loading={usingId === item.id}
          onUse={() => onUse(item)}
        />
      ))}
    </div>
  );
}
