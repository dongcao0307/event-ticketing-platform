import React, { useEffect, useState, useMemo } from "react";
import CancelTicketModal from "../../components/account/CancelTicketModal";
import TicketCard from "../../components/account/TicketCard";
import TicketSuggestionGrid from "../../components/account/TicketSuggestionGrid";
import { serviceGetBookingsByUser } from "../../services/bookingService";
import { getFeaturedEvents } from "../../services/eventService";

const PER_PAGE = 4;

const MyTickets = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const [ticketsData, setTicketsData] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const userDataRaw = localStorage.getItem('user_data');
        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
        const userId = userData?.userId || 1;

        const [bookingsData, featured] = await Promise.all([
          serviceGetBookingsByUser(userId),
          getFeaturedEvents()
        ]);

        const mappedTickets = (Array.isArray(bookingsData) ? bookingsData : []).map(booking => {
          const perf = booking.eventPerformance || {};
          const event = booking.event || {};
          const start = perf.startTime;
          const end = perf.endTime;

          let timeStr = "";
          if (start && end) {
            const dStart = new Date(start);
            const dEnd = new Date(end);
            
            const formatD = (d) => {
              return `${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}, ${d.toLocaleDateString('vi-VN', {day:'2-digit', month:'short', year:'numeric'})}`;
            }

            timeStr = `${formatD(dStart)} - ${formatD(dEnd)}`;
          }

          return {
            id: booking.id,
            title: event.title || "Vé sự kiện",
            status: booking.status,
            startDate: start,
            endDate: end,
            order: booking.id,
            time: timeStr,
            location: event.location || "Chưa xác định",
          };
        });

        setTicketsData(mappedTickets);
        setFeaturedEvents(featured);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredTickets = useMemo(() => {
    let data = [...ticketsData];

    // lọc trạng thái
    if (statusFilter !== "all") {
      data = data.filter((t) => t.status === statusFilter);
    }

    // lọc thời gian
    if (timeFilter === "all")
      return data;

    if (timeFilter === "upcoming") {
      data = data.filter((t) => {
        if (!t.startDate) return false;
        const diff = new Date(t.startDate) - now;
        return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
      });
    }

    if (timeFilter === "past") {
      data = data.filter((t) => {
        if (!t.endDate) return false;
        return new Date(t.endDate) < now;
      });
    }

    return data;
  }, [statusFilter, timeFilter, ticketsData]);

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleCancelTicket = () => {
    closeCancelModal()
  };

  const totalPages = Math.ceil(
    filteredTickets.length / PER_PAGE
  );

  const tickets = useMemo(() => {
    return filteredTickets.slice(
      (page - 1) * PER_PAGE,
      page * PER_PAGE
    );
  }, [page, filteredTickets]);

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">
        Vé của tôi
      </h2>

      {/* FILTER STATUS */}
      <div className="flex gap-3 flex-wrap">

        {[
          { key: "all", label: "Tất cả" },
          { key: "PAID", label: "Thành công" },
          { key: "PENDING", label: "Đang xử lý" },
          { key: "CANCEL", label: "Đã hủy" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setStatusFilter(item.key);
              setPage(1);
            }}
            className={`px-5 py-1 rounded-full text-sm transition
            ${statusFilter === item.key
                ? "bg-[#26bc71] text-black"
                : "bg-gray-600 text-gray-200"
              }`}
          >
            {item.label}
          </button>
        ))}

      </div>

      {/* FILTER TIME */}
      <div className="flex gap-3">

        {[
          { key: "all", label: "Tất cả" },
          { key: "upcoming", label: "Sắp diễn ra" },
          { key: "past", label: "Đã kết thúc" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setTimeFilter(item.key);
              setPage(1);
            }}
            className={`px-5 py-1 rounded-full text-sm transition
            ${timeFilter === item.key
                ? "bg-[#26bc71] text-black"
                : "bg-gray-600 text-gray-200"
              }`}
          >
            {item.label}
          </button>
        ))}

      </div>

      {/* LIST TICKET */}
      {loading ? (
        <div className="text-center py-10 text-gray-300">Đang tải vé...</div>
      ) : (
        <div className="space-y-4">
          {tickets.length === 0 && (
            <div className="text-gray-400 text-center py-10">Không có vé nào</div>
          )}

          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} openCancelModal={openCancelModal} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm
              ${page === i + 1
                  ? "bg-[#26bc71] text-black"
                  : "bg-[#2a3c33]"
                }`}
            >
              {i + 1}
            </button>
          ))}

        </div>
      )}

      {/* SUGGESTION */}
      <TicketSuggestionGrid events={featuredEvents} />

      {/* CANCEL MODAL */}
      <CancelTicketModal
        open={showCancelModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelTicket}
      />
    </div>
  );
};

export default MyTickets;