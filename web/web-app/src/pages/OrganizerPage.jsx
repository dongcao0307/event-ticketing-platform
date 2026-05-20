import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm import này
import Sidebar from '../components/Sidebar'; 
import OrganizerHeader from '../components/OrganizerHeader'; 

// Import các Component con từ thư mục organizer
import Step1EventInfo from './organizer/Step1EventInfo';
import Step2TimeTicket from './organizer/Step2TimeTicket'; 
import Step3Settings from './organizer/Step3Settings';
import Step4Payment from './organizer/Step4Payment';

const OrganizerPage = () => {
  // State quản lý bước hiện tại (mặc định là bước 1)
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  // Hàm xử lý khi nhấn "Lưu" hoặc "Hoàn thành"
  const handleSaveAndFinish = () => {
    // Tạm thời ở đây bạn có thể log ra để kiểm tra
    console.log("Đã lưu sự kiện. Chuẩn bị chuyển trang...");
    
    // Điều hướng về trang danh sách sự kiện
    navigate('/organizer/my-events'); 
  };

  // Hàm để render nội dung động dựa vào bước
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1EventInfo />;
      case 2:
        return <Step2TimeTicket />;
      case 3:
        return <Step3Settings />;
      case 4:
        return <Step4Payment />;
      default:
        return <Step1EventInfo />;
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
              
              {/* Các bước (Steps) */}
              <div className="flex-1 flex items-center justify-between max-w-[1200px] mr-8">
                
                {/* STEP 1 */}
                <div 
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 cursor-pointer transition-colors -mb-[1px]
                    ${currentStep === 1 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                    ${currentStep === 1 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>1</span> 
                  Thông tin sự kiện
                </div>
                
                {/* STEP 2 */}
                <div 
                  onClick={() => setCurrentStep(2)}
                  className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 cursor-pointer transition-colors -mb-[1px]
                    ${currentStep === 2 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                    ${currentStep === 2 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>2</span> 
                  Thời gian & Loại vé
                </div>
                
                {/* STEP 3 */}
                <div 
                  onClick={() => setCurrentStep(3)}
                  className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 cursor-pointer transition-colors -mb-[1px]
                    ${currentStep === 3 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                    ${currentStep === 3 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>3</span> 
                  Cài đặt
                </div>
                
                {/* STEP 4 */}
                <div 
                  onClick={() => setCurrentStep(4)}
                  className={`flex items-center font-medium whitespace-nowrap py-5 border-b-2 cursor-pointer transition-colors -mb-[1px]
                    ${currentStep === 4 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 
                    ${currentStep === 4 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>4</span> 
                  Thông tin thanh toán
                </div>

              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 shrink-0">
                {/* Gắn sự kiện chuyển trang vào nút Lưu */}
                <button 
                  onClick={handleSaveAndFinish}
                  className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition"
                >
                  Lưu
                </button>
                
                {/* Nút Tiếp tục/Hoàn thành */}
                <button 
                  onClick={() => {
                    if (currentStep < 4) {
                      setCurrentStep((prev) => prev + 1);
                    } else {
                      // Nếu đang ở bước 4 (Hoàn thành), thì thực hiện lưu và chuyển trang
                      handleSaveAndFinish();
                    }
                  }}
                  className="px-6 py-2 bg-[#00b14f] text-white text-sm font-medium rounded hover:bg-[#009e47] transition"
                >
                  {currentStep === 4 ? 'Hoàn thành' : 'Tiếp tục'}
                </button>
              </div>

            </div>
          </div>

          {/* ===== DYNAMIC FORM CONTENT ===== */}
          <div className="w-full p-4 md:p-8">
            {/* Hàm này sẽ render Component tương ứng với currentStep */}
            {renderStepContent()} 
          </div>

        </main>
      </div>
    </div>
  );
};

export default OrganizerPage;