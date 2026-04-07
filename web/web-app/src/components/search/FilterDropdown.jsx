import { useState, useRef, useEffect, useMemo } from "react";

const locations = [
    "Toàn quốc",
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Lạt",
    "Vị trí khác",
];

const categories = [
    "Nhạc sống",
    "Sân khấu & Nghệ thuật",
    "Thể Thao",
    "Hội thảo & Workshop",
    "Tham quan & Trải nghiệm",
    "Khác",
];

export default function FilterDropdown({ onApply }) {
    const [open, setOpen] = useState(false);

    const [location, setLocation] = useState("Toàn quốc");
    const [freeOnly, setFreeOnly] = useState(false);
    const [category, setCategory] = useState(null);

    const ref = useRef();

    useEffect(() => {
        const handle = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        window.addEventListener("mousedown", handle);
        return () => window.removeEventListener("mousedown", handle);
    }, []);

    const apply = () => {
        onApply({
            location,
            freeOnly,
            category,
        });

        setOpen(false);
    };

    const reset = () => {
        setLocation("Toàn quốc");
        setFreeOnly(false);
        setCategory(null);
    };

    const hasActiveFilter = useMemo(() => {
        return location !== "Toàn quốc" || freeOnly || category !== null;
    }, [location, freeOnly, category]);

    return (
        <div className="relative" ref={ref}>
            {/* BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
                    ${hasActiveFilter
                        ? "bg-green-500 hover:bg-green-400 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }
                `}
            >
                🔽 Bộ lọc
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-[720px] bg-white rounded-xl shadow-2xl p-6 z-50 text-black">

                    {/* LOCATION */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Vị trí</h3>

                        {locations.map((l) => (
                            <label key={l} className="flex items-center gap-2 mb-2">
                                <input
                                    type="radio"
                                    checked={location === l}
                                    onChange={() => setLocation(l)}
                                />
                                {l}
                            </label>
                        ))}
                    </div>

                    <hr className="my-4" />

                    {/* PRICE */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold">Giá tiền</h3>
                            <p className="text-sm text-gray-500">Miễn phí</p>
                        </div>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={freeOnly}
                                onChange={() => setFreeOnly(!freeOnly)}
                                className="sr-only peer"
                            />

                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:h-4 after:w-4 after:rounded-full peer-checked:after:translate-x-5 after:transition"></div>
                        </label>
                    </div>

                    <hr className="my-4" />

                    {/* CATEGORY */}
                    <div>
                        <h3 className="font-semibold mb-3">Thể loại</h3>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`px-4 py-2 rounded-full border text-sm transition
                    ${category === c
                                            ? "bg-green-500 text-white border-green-500"
                                            : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={reset}
                            className="flex-1 border border-green-500 text-green-600 py-3 rounded-md font-semibold"
                        >
                            Thiết lập lại
                        </button>

                        <button
                            onClick={apply}
                            className="flex-1 bg-green-500 hover:bg-green-400 text-white py-3 rounded-md font-semibold"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}