export default function FilterChips({ filters, remove }) {
  const chips = [];

  if (filters.location && filters.location !== "Toàn quốc")
    chips.push({ key: "location", label: filters.location });

  if (filters.freeOnly)
    chips.push({ key: "freeOnly", label: "Miễn phí" });

  if (filters.category)
    chips.push({ key: "category", label: filters.category });

  return (
    <div className="flex gap-2 flex-wrap">

      {chips.map((chip) => (
        <div
          key={chip.key}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm"
        >
          {chip.label}

          <button onClick={() => remove(chip.key)}>
            ✕
          </button>
        </div>
      ))}

    </div>
  );
}