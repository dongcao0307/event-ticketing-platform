import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/home/EventCard';
import DateFilter from '../components/search/DateRangePicker';
import FilterDropdown from '../components/search/FilterDropdown';
import FilterChips from '../components/search/FilterChips';
import { searchEvents } from '../services/eventService';

const EVENTS_PER_PAGE = 20;

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({});
    const [events, setEvents] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const keyword = searchParams.get('q') || '';

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const result = await searchEvents(keyword, filters, page, EVENTS_PER_PAGE);
            setEvents(result.events || []);
            setTotalElements(result.totalElements || 0);
            setTotalPages(result.totalPages || 1);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, [keyword, filters, page]);

    useEffect(() => {
        setPage(0);
    }, [keyword, filters]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const pageCount = Math.max(1, totalPages);

    return (
        <div className="min-h-screen bg-[#0b1412] text-gray-100">
            <Header />
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-[#151f1b] rounded-2xl border border-[#2f3d37] p-5 shadow-lg">
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {keyword ? `Kết quả cho "${keyword}"` : 'Khám phá sự kiện'}
                            </h1>
                            <p className="text-sm text-gray-300 mt-1">
                                {loading ? 'Đang tìm kiếm...' : `${totalElements} sự kiện được tìm thấy`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <DateFilter onApply={(value) => console.log(value)} />
                            <FilterDropdown onApply={(f) => setFilters(f)} />
                            <FilterChips
                                filters={filters}
                                remove={(key) => setFilters((prev) => ({ ...prev, [key]: null }))}
                            />
                        </div>
                    </header>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <span className="text-xs uppercase tracking-wide text-[#26bc71]">Kết quả</span>
                        <span className="text-xs text-gray-300">Sắp xếp theo: Nổi bật & Mới nhất</span>
                    </div>

                    {loading ? (
                        <div className="mt-12 flex justify-center">
                            <div className="w-8 h-8 border-2 border-[#26bc71] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="mt-12 text-center text-gray-400">
                            <p className="text-lg">Không tìm thấy sự kiện phù hợp.</p>
                            <p className="text-sm mt-2">Hãy thử từ khóa khác hoặc xóa bộ lọc.</p>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {events.map((event) => (
                                <EventCard key={event.id} {...event} />
                            ))}
                        </div>
                    )}

                    {pageCount > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                disabled={page === 0}
                                className="rounded-md bg-[#1d2a26] px-4 py-2 text-sm font-semibold hover:bg-[#2f423b] disabled:opacity-40"
                            >
                                Trước
                            </button>
                            {Array.from({ length: Math.min(pageCount, 10) }, (_, idx) => idx).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPage(num)}
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${page === num ? 'bg-[#26bc71] text-black' : 'bg-[#1d2a26] text-white hover:bg-[#2f423b]'}`}
                                >
                                    {num + 1}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
                                disabled={page >= pageCount - 1}
                                className="rounded-md bg-[#1d2a26] px-4 py-2 text-sm font-semibold hover:bg-[#2f423b] disabled:opacity-40"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchPage;
