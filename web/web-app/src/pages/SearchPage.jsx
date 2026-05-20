import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/home/EventCard';
import DateFilter from '../components/search/DateRangePicker';
import FilterDropdown from "../components/search/FilterDropdown";
import FilterChips from "../components/search/FilterChips";

const EVENTS_PER_PAGE = 20;

const createEvents = () => {
    const base = [
        { title: 'The Traditional Water Puppet Show', location: 'Hà Nội', date: '20 tháng 01, 2026', price: 'Từ 350.000đ', image: 'https://images.unsplash.com/photo-1519730901064-18ed6fdf2cd4?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Crossroads - The Untold Stories', location: 'TP. Hồ Chí Minh', date: '21 tháng 01, 2026', price: 'Từ 575.000đ', image: 'https://images.unsplash.com/photo-1495121605193-b116b5b09bf5?auto=format&fit=crop&w=1200&q=80' },
        { title: 'ĐÊN THÁNH Đêm nhạc Trung Quân', location: 'Hà Nội', date: '23 tháng 01, 2026', price: 'Từ 700.000đ', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80' },
        { title: 'ĐÊN THÁNH Đêm nhạc Hoàng Quyên', location: 'Hà Nội', date: '24 tháng 01, 2026', price: 'Từ 500.000đ', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80' },
        { title: 'ARGU - Live in Vietnam', location: 'Hà Nội', date: '24 tháng 01, 2026', price: 'Từ 999.000đ', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80' },
        { title: 'DEMO MUSIC - ENA', location: 'Hà Nội', date: '01 tháng 02, 2026', price: 'Từ 250.000đ', image: 'https://images.unsplash.com/photo-1512080872261-9d5e778ed2fb?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Kịch Xóm', location: 'TP. Hồ Chí Minh', date: '05 tháng 02, 2026', price: 'Từ 200.000đ', image: 'https://images.unsplash.com/photo-1527060397950-31b8f0b6fe03?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Workshop Terrarium', location: 'Hà Nội', date: '08 tháng 02, 2026', price: 'Từ 420.000đ', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Concert Jazz Night', location: 'Đà Nẵng', date: '12 tháng 02, 2026', price: 'Từ 350.000đ', image: 'https://images.unsplash.com/photo-1513283487479-d8d9c1c0b7c1?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Lễ hội Ánh sáng', location: 'Hà Nội', date: '15 tháng 02, 2026', price: 'Từ 180.000đ', image: 'https://images.unsplash.com/photo-1453974336165-b28f7a47d14d?auto=format&fit=crop&w=1200&q=80' },
    ];

    // duplicate to reach >60 events
    const items = [];
    for (let i = 0; i < 7; i += 1) {
        items.push(...base.map((event, idx) => ({
            id: `${i}-${idx}`,
            ...event,
        })));
    }

    return items;
};

const SearchPage = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const events = useMemo(() => createEvents(), []);
    const pageCount = Math.ceil(events.length / EVENTS_PER_PAGE);

    const displayEvents = events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[#0b1412] text-gray-100">
            <Header />
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-[#151f1b] rounded-2xl border border-[#2f3d37] p-5 shadow-lg">
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
                            <p className="text-sm text-gray-300 mt-1">{events.length} sự kiện tìm được trong 2 trang</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <DateFilter onApply={(value) => console.log(value)} />
                            <FilterDropdown
                                onApply={(f) => setFilters(f)}
                            />
                            <FilterChips
                                filters={filters}
                                remove={(key) =>
                                    setFilters((prev) => ({ ...prev, [key]: null }))
                                }
                            />
                        </div>
                    </header>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <span className="text-xs uppercase tracking-wide text-[#26bc71]">Kết quả</span>
                        <span className="text-xs text-gray-300">Sắp xếp theo: Mới nhất</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {displayEvents.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="rounded-md bg-[#1d2a26] px-4 py-2 text-sm font-semibold hover:bg-[#2f423b] disabled:opacity-40"
                        >
                            Trước
                        </button>

                        {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setPage(num)}
                                className={`rounded-md px-3 py-2 text-sm font-semibold ${page === num ? 'bg-[#26bc71] text-black' : 'bg-[#1d2a26] text-white hover:bg-[#2f423b]'}`}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className="rounded-md bg-[#1d2a26] px-4 py-2 text-sm font-semibold hover:bg-[#2f423b] disabled:opacity-40"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchPage;
