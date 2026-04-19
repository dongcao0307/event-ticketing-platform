import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import OrganizerHeader from '../components/OrganizerHeader'; 
import { organizerEventService } from '../services/organizerEventService'; 

import Step1EventInfo from './organizer/Step1EventInfo';
import Step2TimeTicket from './organizer/Step2TimeTicket'; 
import Step3Settings from './organizer/Step3Settings';
import Step4Payment from './organizer/Step4Payment';

const OrganizerPage = () => {
  // 1. LẤY ID TỪ URL (Nếu URL có ID -> Chế độ Sửa, Nếu không có -> Tạo mới)
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 2. STATE TỔNG - KHAI BÁO ĐẦY ĐỦ ĐỂ CHỐNG LỖI UNDEFINED Ở CÁC BƯỚC
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    categoryId: 1,
    thumbnailUrl: '',
    posterUrl: '',
    venueName: '',
    eventType: 'offline',
    // --- KHAI BÁO SẴN CHO BAN TỔ CHỨC ---
    organizerName: '',
    organizerInfo: '',
    organizerLogo: '',
    // --- BẮT BUỘC PHẢI CÓ [] ĐỂ CHỐNG LỖI BƯỚC 2 ---
    performances: [], 
    ticketTypes: [], 
    settings: {},
    paymentInfo: {}
  });

  // 3. TỰ ĐỘNG KÉO DỮ LIỆU CŨ NẾU LÀ CHẾ ĐỘ CHỈNH SỬA
  useEffect(() => {
    if (isEditMode) {
     const fetchOldEventData = async () => {
        try {
          const data = await organizerEventService.getEventById(id);
          console.log("🟢 DỮ LIỆU TỪ BACKEND:", data);
          let mappedData = { ...data };

          // 1. XỬ LÝ MÔ TẢ CHUNG
          mappedData.description = data.description || '';

          // 2. XỬ LÝ ĐỊA CHỈ (VENUE)
          if (data.performances && data.performances.length > 0 && data.performances[0].venue) {
            const venue = data.performances[0].venue;
            mappedData.venueName = venue.name;
            mappedData.province = venue.city;
            mappedData.eventType = 'offline';

            const addrParts = venue.address ? venue.address.split(', ') : [];
            mappedData.street = addrParts[0] || '';
            mappedData.ward = addrParts[1] || '';
            mappedData.district = addrParts[2] || '';
          } else {
            mappedData.eventType = 'online';
          }

          // 3. XỬ LÝ THÔNG TIN BAN TỔ CHỨC & DANH MỤC 
          mappedData.organizerName = data.organizerName || (data.organizer && data.organizer.name) || '';
          mappedData.organizerInfo = data.organizerInfo || (data.organizer && (data.organizer.info || data.organizer.description)) || '';
          mappedData.organizerLogo = data.organizerLogo || (data.organizer && (data.organizer.logo || data.organizer.avatar)) || '';
          mappedData.categoryId = data.categoryId || (data.category && data.category.id) || 1;

          // 4. ĐẢM BẢO CÁC MẢNG KHÔNG BỊ LỖI
          mappedData.ticketTypes = data.ticketTypes || [];
          mappedData.performances = data.performances || [];

          setEventData(mappedData);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu sự kiện:", error);
          alert("Không thể tải dữ liệu sự kiện để chỉnh sửa!");
          navigate('/organizer/my-events');
        }
      };

      fetchOldEventData();
    }
  }, [id, navigate, isEditMode]);

  // 4. HÀM XỬ LÝ LƯU CUỐI CÙNG (GỌI API TỔNG)
  const handleFinalSave = async () => {
    if (!eventData.title.trim()) {
      alert("Vui lòng nhập tên sự kiện ở Bước 1!");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(eventData));

      // Ép kiểu ngày tháng sang chuẩn Java (YYYY-MM-DDTHH:mm:00)
      if (payload.performances && payload.performances.length > 0) {
        payload.performances.forEach(perf => {
          if (perf.startTime && perf.startTime.includes('-') && !perf.startTime.includes('T')) {
             const [datePart, timePart] = perf.startTime.split(' ');
             const [day, month, year] = datePart.split('-');
             perf.startTime = `${year}-${month}-${day}T${timePart}:00`;
          }
          if (perf.endTime && perf.endTime.includes('-') && !perf.endTime.includes('T')) {
             const [datePart, timePart] = perf.endTime.split(' ');
             const [day, month, year] = datePart.split('-');
             perf.endTime = `${year}-${month}-${day}T${timePart}:00`;
          }
        });
      }

      console.log(`Đang gửi 'Mega DTO' lên Backend (${isEditMode ? 'CẬP NHẬT' : 'TẠO MỚI'}):`, payload);
      
      // KIỂM TRA ĐỂ GỌI ĐÚNG API
      if (isEditMode) {
        await organizerEventService.updateEvent(id, payload);
        alert("Sự kiện đã được cập nhật thành công!");
      } else {
        await organizerEventService.createFullEvent(payload);
        alert("Chúc mừng! Sự kiện đã được tạo thành công.");
      }
      
      navigate('/organizer/my-events');
    } catch (error) {
      console.error("Lỗi lưu sự kiện:", error);
      alert("Có lỗi xảy ra khi lưu sự kiện. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. ĐIỀU HƯỚNG GIỮA CÁC BƯỚC
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // 6. RENDER NỘI DUNG TƯƠNG ỨNG MỖI BƯỚC
  const renderStepContent = () => {
    const props = { eventData, setEventData };

    switch (currentStep) {
      case 1:
        return <Step1EventInfo {...props} />;
      case 2:
        return <Step2TimeTicket {...props} />;
      case 3:
        return <Step3Settings {...props} />;
      case 4:
        return <Step4Payment {...props} />;
      default:
        return <Step1EventInfo {...props} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OrganizerHeader />

        <main className="flex-1 overflow-y-auto bg-[#0e0e0e] flex flex-col">
          
          {/* ===== FULL-WIDTH STEPPER & BUTTONS ===== */}
          <div className="w-full border-b border-gray-800 bg-[#121212] sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 lg:px-12">
              
              {/* Thanh điều hướng các bước (Stepper) */}
              <div className="flex-1 flex items-center justify-between max-w-[1200px] mr-8">
                {[
                  { id: 1, label: 'Thông tin sự kiện' },
                  { id: 2, label: 'Thời gian & Loại vé' },
                  { id: 3, label: 'Cài đặt' },
                  { id: 4, label: 'Thông tin thanh toán' }
                ].map((step) => (
                  <div 
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 cursor-pointer transition-colors -mb-[1px]
                      ${currentStep === step.id ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                      ${currentStep === step.id ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>
                      {step.id}
                    </span> 
                    {step.label}
                  </div>
                ))}
              </div>

              {/* Nhóm nút hành động */}
              <div className="flex gap-3 shrink-0">
                {currentStep > 1 && (
                  <button 
                    onClick={handleBackStep}
                    className="px-6 py-2 bg-[#2a2b31] text-white text-sm font-medium rounded hover:bg-[#3a3b40] transition"
                  >
                    Quay lại
                  </button>
                )}
                
                <button 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className={`px-6 py-2 text-white text-sm font-medium rounded transition ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#00b14f] hover:bg-[#009e47]'}`}
                >
                  {isLoading ? 'Đang xử lý...' : (currentStep === 4 ? (isEditMode ? 'Lưu cập nhật' : 'Hoàn thành') : 'Tiếp tục')}
                </button>
              </div>

            </div>
          </div>

          {/* ===== NỘI DUNG FORM THAY ĐỔI THEO BƯỚC ===== */}
          <div className="w-full p-4 md:p-8">
            {renderStepContent()} 
          </div>

        </main>
      </div>
    </div>
  );
};

export default OrganizerPage;