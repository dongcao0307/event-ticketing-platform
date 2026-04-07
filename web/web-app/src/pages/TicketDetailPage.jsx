import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import TicketDetailHeader from "../components/account/TicketDetailHeader";
import TicketOrderInfo from "../components/account/TicketOrderInfo";
import TicketBuyerInfo from "../components/account/TicketBuyerInfo";
import TicketOrderTable from "../components/account/TicketOrderTable";
import { getTicketById } from "../services/ticketService";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data);
      setLoading(false);
    };

    loadTicket();
  }, [id]);

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