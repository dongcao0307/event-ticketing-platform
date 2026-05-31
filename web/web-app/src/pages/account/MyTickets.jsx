import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CancelTicketModal from "../../components/account/CancelTicketModal";
import TicketCard from "../../components/account/TicketCard";
import TicketSuggestionGrid from "../../components/account/TicketSuggestionGrid";
import { serviceGetBookingsByUser } from "../../services/bookingService";
import { getFeaturedEvents } from "../../services/eventService";
import { useEvent } from "../../hooks/useEvent";
import { useToast } from "../../context/ToastContext";
import { getUserIdFromToken } from "../../utils/tokenUtils";

const PER_PAGE = 4;

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "";
  const start = new Date(startTime);
  const end = new Date(endTime);
  const startLabel = start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const endLabel = end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${startLabel} - ${endLabel}`;
};

const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const MyTickets = () => {
  const navigate = useNavigate();
  const { setBookingOrderData, setSelectedTicketDetail } = useEvent();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const [ticketsData, setTicketsData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const userId = getUserIdFromToken() || 1;

        const [bookings, featured] = await Promise.all([
          serviceGetBookingsByUser(userId),
          getFeaturedEvents()
        ]);

        setBookingsData(Array.isArray(bookings) ? bookings : []);

        const mappedTickets = (Array.isArray(bookings) ? bookings : []).map(booking => {
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

  const openCancelModal = (booking) => {
    setSelectedBookingToCancel(booking || null);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleCancelTicket = async () => {
    if (!selectedBookingToCancel) {
      closeCancelModal();
      return;
    }

    // Decide where to route cancel: if paid and amount > 0 => request refund via Payment Service
    try {
      const booking = selectedBookingToCancel;
      if (booking.status === 'PAID' && Number(booking.totalAmount || booking.total || 0) > 0) {
        // Request refund
        const { serviceRequestRefund } = await import('../../services/paymentService');
        const refundResponse = await serviceRequestRefund({
          orderId: booking.id,
          reason: 'user_cancel',
          idempotencyKey: `refund-${booking.id}-${Date.now()}`,
        });

        if (refundResponse) {
          showSuccessToast("Yêu cầu hủy vé đang được xử lý");
        } else {
          showErrorToast("Đã xảy ra lỗi khi thực hiện hủy vé");
        }
      } else {
        // Non-paid or zero-amount: mark booking canceled via booking API
        const { serviceUpdateBookingStatusAdmin } = await import('../../services/bookingService');
        await serviceUpdateBookingStatusAdmin(booking.id, 'CANCEL');
      }
    } catch (err) {
      console.error('Cancel action failed', err);
      showErrorToast("Đã xảy ra lỗi khi thực hiện hủy vé");
    } finally {
      closeCancelModal();
    }
  };

  // Map booking data by ticket ID để dễ lookup
  const bookingMap = useMemo(() => {
    const map = new Map();
    bookingsData.forEach(booking => {
      map.set(booking.id, booking);
    });
    return map;
  }, [bookingsData]);

  // Handler để gọi khi nhấn vào ticket card
  const handleTicketCardClick = (booking) => {
    if (!booking) {
      console.error("Invalid booking data:", booking);
      return;
    }

    // DEBUG
    console.log("=== Ticket Card Click ===");
    console.log("Booking data:", booking);
    console.log("Setting selectedTicketDetail...");

    // Lưu booking vào Redux state
    setSelectedTicketDetail(booking);

    // Navigate đến chi tiết vé
    navigate(`/ticket/${booking.id}`);
  };

  // Handler để gọi khi nhấn "Tiếp tục thanh toán"
  const handlePaymentClick = (booking) => {
    if (!booking || !booking.event) {
      console.error("Invalid booking data:", booking);
      return;
    }

    // Set Redux store với full booking data
    setBookingOrderData({
      order: {
        id: booking.id,
        subtotal: booking.subtotal || 0,
        discountAmount: booking.discountAmount || 0,
        totalAmount: booking.totalAmount || 0,
        status: booking.status,
        expiredAt: booking.expiredAt,
        createdAt: booking.createdAt,
      },
      orderItems: booking.items || [],
      context: {
        event: {
          id: booking.event?.id,
          title: booking.event?.title,
          location: booking.event?.venue?.name || booking.event?.venue?.address || "Chưa xác định",
        },
        showtime: {
          id: booking.eventPerformance?.id,
          startTime: booking.eventPerformance?.startTime,
          endTime: booking.eventPerformance?.endTime,
          label: formatTimeRange(booking.eventPerformance?.startTime, booking.eventPerformance?.endTime),
          date: formatDateLabel(booking.eventPerformance?.startTime),
        },
        buyer: {
          email: localStorage.getItem('user_email') || '',
        },
        tickets: [],
      },
    });

    // Navigate đến trang payment với format /event/:id/payment?bookingId=xxx
    // bookingId query param để an toàn khi refresh page (Redux state sẽ mất)
    navigate(`/event/${booking.event.id}/payment?bookingId=${booking.id}`);
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
          { key: "CANCELLED", label: "Đã hủy" },
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

          {tickets.map((ticket) => {
            const rawBooking = bookingMap.get(ticket.id);
            return (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket}
                rawBooking={rawBooking}
                onCardClick={handleTicketCardClick}
                onPaymentClick={handlePaymentClick}
                openCancelModal={openCancelModal} 
              />
            );
          })}
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