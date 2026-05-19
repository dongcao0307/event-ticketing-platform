import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import OrganizerHeader from '../components/OrganizerHeader'; 
import { organizerEventService } from '../services/organizerEventService';
import { authService } from '../services/authService'; 

import Step1EventInfo from './organizer/Step1EventInfo';
import Step2TimeTicket from './organizer/Step2TimeTicket'; 
import Step3Settings from './organizer/Step3Settings';
import Step4Payment from './organizer/Step4Payment';

const OrganizerPage = () => {
  const { id } = useParams(); 
  const isEditMode = !!id; 
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check authentication on component mount
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      // User is not logged in - redirect to home and show login
      navigate('/');
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }
  }, [navigate]);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    categoryId: 1,
    thumbnailUrl: '',
    posterUrl: '',
    venueName: '',
    eventType: 'offline',
    organizerName: '',
    organizerInfo: '',
    organizerLogo: '',
    performances: [], 
    ticketTypes: [], 
    settings: {},
    paymentInfo: {}
  });

  useEffect(() => {
    if (isEditMode) {
     const fetchOldEventData = async () => {
        try {
          const data = await organizerEventService.getEventById(id);
          let mappedData = { ...data };

          mappedData.description = data.description || '';

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

          mappedData.organizerName = data.organizerName || (data.organizer && data.organizer.name) || '';
          mappedData.organizerInfo = data.organizerInfo || (data.organizer && (data.organizer.info || data.organizer.description)) || '';
          mappedData.organizerLogo = data.organizerLogo || (data.organizer && (data.organizer.logo || data.organizer.avatar)) || '';
          mappedData.categoryId = data.categoryId || (data.category && data.category.id) || 1;

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

  // =====================================================================
  // LOGIC VALIDATION
  // =====================================================================
  const validateStep1 = () => {
    const d = eventData;
    if (!d.title?.trim() || !d.description?.trim() || !d.organizerName?.trim() || !d.organizerInfo?.trim()) return false;
    if (!d.thumbnailUrl || !d.posterUrl || !d.organizerLogo) return false;
    if (d.eventType === 'offline') {
      if (!d.venueName?.trim() || !d.province || !d.street?.trim()) return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const perfs = eventData.performances;
    if (!perfs || perfs.length === 0) return false; 
    for (const p of perfs) {
      if (!p.startTime || !p.endTime) return false; 
      if (!p.tickets || p.tickets.length === 0) return false; 
    }
    return true;
  };

  const validateStep3 = () => {
    const customUrl = eventData.settings?.customUrl;
    if (!customUrl || !customUrl.trim()) return false;
    if (!/^[a-zA-Z0-9-]+$/.test(customUrl)) return false; 
    return true;
  };

  const validateStep4 = () => {
    const p = eventData.paymentInfo || {};
    if (!p.accountName?.trim() || !p.accountNumber?.trim() || !p.bankName || !p.branch || !p.fullName?.trim() || !p.address?.trim()) return false;
    if (p.businessType === 'Doanh nghiệp' && !p.taxCode?.trim()) return false;
    return true;
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    if (currentStep === 4) return validateStep4();
    return true;
  };

  let maxReachableStep = 1;
  if (validateStep1()) maxReachableStep = 2;
  if (validateStep1() && validateStep2()) maxReachableStep = 3;
  if (validateStep1() && validateStep2() && validateStep3()) maxReachableStep = 4;

  // =====================================================================

  const handleFinalSave = async () => {
    setIsLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(eventData));

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

  const handleNextStep = () => {
    // Nếu Đang Sửa thì cho qua tự do. Nếu Tạo Mới thì phải Validate
    if (isEditMode || isCurrentStepValid()) {
      if (currentStep < 4) setCurrentStep(prev => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    const props = { eventData, setEventData, key: location.pathname};
    switch (currentStep) {
      case 1: return <Step1EventInfo {...props} />;
      case 2: return <Step2TimeTicket {...props} />;
      case 3: return <Step3Settings {...props} />;
      case 4: return <Step4Payment {...props} />;
      default: return <Step1EventInfo {...props} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OrganizerHeader />

        <main className="flex-1 overflow-y-auto bg-[#0e0e0e] flex flex-col">
          
          <div className="w-full border-b border-gray-800 bg-[#121212] sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 lg:px-12">
              
              {/* THANH ĐIỀU HƯỚNG */}
              <div className="flex-1 flex items-center justify-between max-w-[1200px] mr-8">
                {[
                  { id: 1, label: 'Thông tin sự kiện' },
                  { id: 2, label: 'Thời gian & Loại vé' },
                  { id: 3, label: 'Cài đặt' },
                  { id: 4, label: 'Thông tin thanh toán' }
                ].map((step) => {
                  // Đang sửa -> Mở khóa bấm tự do mọi tab. Đang tạo -> Khóa các bước chưa tới
                  const isClickable = isEditMode || step.id <= maxReachableStep || step.id === currentStep;
                  
                  return (
                  <div 
                    key={step.id}
                    onClick={() => {
                      if (isClickable) setCurrentStep(step.id);
                    }}
                    className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 -mb-[1px] transition-colors
                      ${currentStep === step.id 
                        ? 'text-[#00b14f] border-[#00b14f] cursor-pointer' 
                        : isClickable 
                          ? 'text-gray-400 border-transparent hover:text-gray-200 cursor-pointer' 
                          : 'text-gray-600 border-transparent cursor-not-allowed opacity-50' 
                      }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                      ${currentStep === step.id ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>
                      {step.id}
                    </span> 
                    {step.label}
                  </div>
                )})}
              </div>

              {/* KHỐI NÚT HÀNH ĐỘNG (ĐÃ SỬA LẠI THEO YÊU CẦU PM) */}
              <div className="flex gap-3 shrink-0">
                {/* Nút Quay Lại */}
                {currentStep > 1 && (
                  <button onClick={handleBackStep} className="px-6 py-2 bg-[#2a2b31] text-white text-sm font-medium rounded hover:bg-[#3a3b40] transition">
                    Quay lại
                  </button>
                )}
                
                {/* Nút Tiếp Tục (Chỉ hiện khi chưa tới B4) */}
                {currentStep < 4 && (
                  <button 
                    onClick={handleNextStep}
                    disabled={isLoading || (!isEditMode && !isCurrentStepValid())} 
                    className={`px-6 py-2 text-white text-sm font-medium rounded transition 
                      ${isLoading || (!isEditMode && !isCurrentStepValid()) 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : isEditMode 
                          ? 'bg-[#2a2b31] hover:bg-[#3a3b40] border border-gray-600' // Nếu là chế độ sửa, nút Tiếp tục thành màu tối để nhường sự chú ý cho nút Lưu
                          : 'bg-[#00b14f] hover:bg-[#009e47]'
                      }`}
                  >
                    Tiếp tục
                  </button>
                )}

                {/* Nút HOÀN THÀNH (Tạo Mới) */}
                {!isEditMode && currentStep === 4 && (
                  <button 
                    onClick={handleFinalSave}
                    disabled={isLoading || !isCurrentStepValid()} 
                    className={`px-6 py-2 text-white text-sm font-medium rounded transition 
                      ${isLoading || !isCurrentStepValid() ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#00b14f] hover:bg-[#009e47]'}`}
                  >
                    Hoàn thành
                  </button>
                )}

                {/* NÚT LƯU CẬP NHẬT (LUÔN MỞ Ở MỌI BƯỚC KHI ĐANG SỬA) */}
                {isEditMode && (
                  <button 
                    onClick={handleFinalSave}
                    disabled={isLoading} // KHÔNG KIỂM TRA VALIDATION CỦA BƯỚC NỮA -> LUÔN MỞ
                    className={`px-6 py-2 text-white text-sm font-medium rounded transition 
                      ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#00b14f] hover:bg-[#009e47] shadow-[0_0_10px_rgba(0,177,79,0.3)]'}`}
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu cập nhật'}
                  </button>
                )}

              </div>

            </div>
          </div>

          {/* ===== NỘI DUNG FORM ===== */}
          <div className="w-full p-4 md:p-8">
            {renderStepContent()} 
          </div>

        </main>
      </div>
    </div>
  );
};

export default OrganizerPage;