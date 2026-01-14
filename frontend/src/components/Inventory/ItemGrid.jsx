import ItemCard from "./ItemCard.jsx";

function sortItems(items) {
  const CATEGORY_ORDER = {
    FOOD: 1,
    TOY: 2,
    HYGIENE: 3
  };

  return [...items].sort((a, b) => {
    const orderA = CATEGORY_ORDER[a.category?.toUpperCase()] ?? 999;
    const orderB = CATEGORY_ORDER[b.category?.toUpperCase()] ?? 999;
    if (orderA !== orderB) return orderA - orderB;

    const effectA = a.effect?.amount ?? 0;
    const effectB = b.effect?.amount ?? 0;
    return effectA - effectB;
  });
}

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
