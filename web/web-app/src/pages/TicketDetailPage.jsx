import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import TicketDetailHeader from "../components/account/TicketDetailHeader";
import TicketOrderInfo from "../components/account/TicketOrderInfo";
import TicketBuyerInfo from "../components/account/TicketBuyerInfo";
import TicketOrderTable from "../components/account/TicketOrderTable";
import { getTicketById } from "../services/ticketService";
import { serviceGetBookingById } from "../services/bookingService";
import { useEvent } from "../hooks/useEvent";

const formatDateParts = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatTimeParts = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric",  hour: "2-digit", minute: "2-digit" });
};

// Chuyển booking data thành ticket object format
const convertBookingToTicket = (booking) => {
  if (!booking) return null;

  console.log("convertBookingToTicket input:", booking);

  const event = booking.event || {};
  const perf = booking.eventPerformance || {};
  const startTime = formatDateTime(perf.startTime);
  const endTime = formatDateTime(perf.endTime);
  const orderDate = formatDateParts(booking.createdAt);
  
  console.log("event:", event);
  console.log("perf:", perf);
  console.log("startTime:", startTime, "endTime:", endTime);
  
  // Lấy user data từ localStorage
  let userData = null;
  try {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      userData = JSON.parse(userDataStr);
    }
  } catch (e) {
    console.error("Error parsing user_data:", e);
  }
  
  // Xác định payment status dựa vào totalAmount
  const payment = booking.totalAmount === 0 ? "Miễn phí" : "Thanh toán điện tử";

  const result = {
    title: event.title || "Vé sự kiện",
    image: event.imageUrl || "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=600",
    type: event.category || "OTHER",
    start: startTime,
    end: endTime,
    orderCode: `#${booking.id}`,
    orderDate,
    payment,
    status: booking.status || "PENDING",
    buyer: {
      name: userData?.fullName || "Khách hàng",
      email: userData?.email || "N/A",
    },
    tickets: (booking.items || []).map((item, idx) => ({
      id: item.ticketTypeId,
      name: `${item.ticketName}`,
      quantity: item.quantity || 1,
      price: item.unitPrice || 0,
    })),
  };
  
  console.log("convertBookingToTicket output:", result);
  return result;
};

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTicketDetail } = useEvent();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true);
      try {
        // DEBUG
        console.log("=== TicketDetailPage Load ===");
        console.log("selectedTicketDetail:", selectedTicketDetail);
        console.log("id:", id);
        
        // Ưu tiên lấy từ Redux state (selectedTicketDetail)
        if (selectedTicketDetail) {
          console.log("Using Redux selectedTicketDetail");
          const convertedTicket = convertBookingToTicket(selectedTicketDetail);
          console.log("Converted ticket:", convertedTicket);
          setTicket(convertedTicket);
        } else {
          console.log("Fallback to API fetch");
          // Fallback: lấy từ booking API
          const bookingData = await serviceGetBookingById(id);
          console.log("Booking data from API:", bookingData);
          if (bookingData) {
            const convertedTicket = convertBookingToTicket(bookingData);
            setTicket(convertedTicket);
          } else {
            // Fallback: thử lấy từ ticket service
            const ticketData = await getTicketById(id);
            setTicket(ticketData);
          }
        }
      } catch (err) {
        console.error("Error loading ticket:", err);
        // Fallback nếu booking không tìm thấy
        try {
          const ticketData = await getTicketById(id);
          setTicket(ticketData);
        } catch (e) {
          setTicket(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id, selectedTicketDetail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100 bg-[#0f1720]">
        <p>Đang tải chi tiết vé...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100 bg-[#0f1720]">
        <p>Không tìm thấy vé.</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* BACKGROUND giống Ticketbox */}
      <div className="min-h-screen bg-gradient-to-b from-[#0f1720] via-[#161c25] to-[#1e2430] py-10">

        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto text-sm text-gray-400 mb-4 px-4 flex items-center gap-2">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            Trang chủ
          </div>
          ›
          <div onClick={() => navigate("/my-account/tickets")} className="cursor-pointer">
            Vé của tôi
          </div>
          ›
          <div>
            Chi tiết vé
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto px-4 space-y-6">

          <div className="bg-[#3a3c40] rounded-lg shadow-lg">
            <TicketDetailHeader ticket={ticket} />
          </div>

          <div className="bg-[#3a3c40] rounded-lg shadow-lg">
            <TicketOrderInfo ticket={ticket} />
          </div>

          <div className="bg-[#3a3c40] rounded-lg shadow-lg">
            <TicketBuyerInfo buyer={ticket.buyer} />
          </div>

          <div className="bg-[#3a3c40] rounded-lg shadow-lg">
            <TicketOrderTable tickets={ticket.tickets} />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default TicketDetailPage;