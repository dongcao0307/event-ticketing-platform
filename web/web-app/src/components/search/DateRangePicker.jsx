import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- UTILS ---------------- */

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBetween = (d, start, end) => {
  if (!start || !end) return false;
  return d >= start && d <= end;
};

const formatButtonLabel = (preset, start, end) => {
  if (preset) return preset;
  if (start && end) {
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1
      }`;
  }
  return "Tất cả các ngày";
};

/* ---------------- PRESETS ---------------- */

const PRESETS = [
  "Tất cả các ngày",
  "Hôm nay",
  "Ngày mai",
  "Cuối tuần này",
  "Tháng này",
];

/* ---------------- MAIN COMPONENT ---------------- */

export default function DateRangePicker({ onApply }) {
  const today = startOfDay(new Date());

  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState("Tất cả các ngày");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [viewDate, setViewDate] = useState(startOfMonth(today));

  const ref = useRef();

  const prevMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    );
  };

  /* -------- CLOSE WHEN CLICK OUTSIDE -------- */

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  /* -------- PRESET HANDLER -------- */

  const applyPreset = (p) => {
    setPreset(p);

    if (p === "Tất cả các ngày") {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    if (p === "Hôm nay") {
      setStartDate(today);
      setEndDate(today);
      return;
    }

    if (p === "Ngày mai") {
      const d = addDays(today, 1);
      setStartDate(today);
      setEndDate(d);
      return;
    }

    if (p === "Cuối tuần này") {
      const day = today.getDay();
      const sunday = addDays(today, (7 - day + 7) % 7);

      setStartDate(today);
      setEndDate(sunday);
      return;
    }

    if (p === "Tháng này") {
      setStartDate(today);
      setEndDate(endOfMonth(today));
    }
  };

  /* -------- DATE CLICK -------- */

  const handleDateClick = (date) => {
    setPreset(null);

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (date < startDate) {
      setStartDate(date);
      setEndDate(startDate);
    } else {
      setEndDate(date);
    }
  };

  /* -------- CALENDAR GENERATOR -------- */

  const generateMonthDays = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const days = [];

    const startWeekday = (start.getDay() + 6) % 7;

    for (let i = 0; i < startWeekday; i++) days.push(null);

    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), d));
    }

    return days;
  };

  /* -------- APPLY -------- */

  const apply = () => {
    onApply?.({
      startDate,
      endDate,
      preset,
    });

    setOpen(false);
  };

  /* ---------------- RENDER ---------------- */

  const month1 = viewDate;
  const month2 = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);

  const days1 = generateMonthDays(month1);
  const days2 = generateMonthDays(month2);

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition flex items-center gap-2"
      >
        📅 {formatButtonLabel(preset, startDate, endDate)}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[760px] bg-white text-black rounded-xl shadow-2xl p-5 z-50">
          {/* PRESETS */}
          <div className="flex gap-2 flex-wrap mb-4">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`px-3 py-1 rounded-md text-sm border transition ${preset === p
                  ? "border-green-500 text-green-600"
                  : "border-gray-200 text-gray-600"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="border-y py-4">

            {/* MONTH NAVIGATION */}
            <div className="flex items-center justify-between mb-4">

              <button
                onClick={prevMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ◀
              </button>

              <div className="flex gap-[280px] font-semibold">
                <span>
                  Tháng {month1.getMonth() + 1}, {month1.getFullYear()}
                </span>

                <span>
                  Tháng {month2.getMonth() + 1}, {month2.getFullYear()}
                </span>
              </div>

              <button
                onClick={nextMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ▶
              </button>

            </div>

            {/* CALENDAR */}
            <div className="grid grid-cols-2 gap-8">
              <Calendar
                month={month1}
                days={days1}
                startDate={startDate}
                endDate={endDate}
                onClick={handleDateClick}
              />

              <Calendar
                month={month2}
                days={days2}
                startDate={startDate}
                endDate={endDate}
                onClick={handleDateClick}
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setPreset("Tất cả các ngày");
                setStartDate(null);
                setEndDate(null);
              }}
              className="border border-green-500 text-green-600 px-6 py-2 rounded-md"
            >
              Thiết lập lại
            </button>

            <button
              onClick={apply}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-400"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CALENDAR ---------------- */

function Calendar({ month, days, startDate, endDate, onClick }) {
  return (
    <div>
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <div key={d} className="text-gray-500 text-xs">
            {d}
          </div>
        ))}

        {days.map((date, i) => {
          if (!date) return <div key={i}></div>;

          const selectedStart = isSameDay(date, startDate);
          const selectedEnd = isSameDay(date, endDate);
          const inRange = isBetween(date, startDate, endDate);

          return (
            <button
              key={i}
              onClick={() => onClick(date)}
              className={`
                p-2 rounded-md text-sm
                ${selectedStart || selectedEnd ? "bg-blue-600 text-white" : ""}
                ${inRange ? "bg-blue-100" : ""}
                hover:bg-blue-200
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}