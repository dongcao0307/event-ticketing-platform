import React, { useState } from 'react';

// TÁI SỬ DỤNG TRỰC TIẾP 4 BƯỚC ĐÃ CODE TỪ TRƯỚC
import Step1EventInfo from '../organizer/Step1EventInfo';
import Step2TimeTicket from '../organizer/Step2TimeTicket';
import Step3Settings from '../organizer/Step3Settings';
import Step4Payment from '../organizer/Step4Payment';

const EditEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);

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
    <div className="flex flex-col w-full text-gray-200">
      
      {/* ===== STEPPER HEADER ===== */}
      {/* Đã sửa lại padding, margin và set z-50 để đảm bảo luôn nổi lên trên cùng */}
      <div className="w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -mt-4 md:-mt-8 -mx-4 md:-mx-8 px-4 md:px-8 bg-[#121212] sticky top-0 z-50 border-b border-gray-800">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4">
          
          {/* Các bước (Steps) */}
          {/* ĐÃ SỬA LỖI THANH CUỘN: Thêm overflow-y-hidden và [&::-webkit-scrollbar]:hidden */}
          <div className="flex-1 flex items-center justify-between max-w-[1000px] overflow-x-auto overflow-y-hidden xl:mr-8 [&::-webkit-scrollbar]:hidden">
            
            {/* STEP 1 */}
            <div 
              onClick={() => setCurrentStep(1)}
              className={`flex items-center font-medium whitespace-nowrap py-4 pr-6 border-b-2 cursor-pointer transition-colors -mb-[1px]
                ${currentStep === 1 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 
                ${currentStep === 1 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>1</span> 
              Thông tin sự kiện
            </div>
            
            {/* STEP 2 */}
            <div 
              onClick={() => setCurrentStep(2)}
              className={`flex items-center font-medium whitespace-nowrap py-4 pr-6 border-b-2 cursor-pointer transition-colors -mb-[1px]
                ${currentStep === 2 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 
                ${currentStep === 2 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>2</span> 
              Thời gian & Loại vé
            </div>
            
            {/* STEP 3 */}
            <div 
              onClick={() => setCurrentStep(3)}
              className={`flex items-center font-medium whitespace-nowrap py-4 pr-6 border-b-2 cursor-pointer transition-colors -mb-[1px]
                ${currentStep === 3 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 
                ${currentStep === 3 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>3</span> 
              Cài đặt
            </div>
            
            {/* STEP 4 */}
            <div 
              onClick={() => setCurrentStep(4)}
              className={`flex items-center font-medium whitespace-nowrap py-4 pr-4 border-b-2 cursor-pointer transition-colors -mb-[1px]
                ${currentStep === 4 ? 'text-[#00b14f] border-[#00b14f]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 
                ${currentStep === 4 ? 'bg-[#00b14f] text-white' : 'bg-[#2a2b31] text-gray-400'}`}>4</span> 
              Thông tin thanh toán
            </div>

          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 shrink-0 pb-3 xl:pb-0">
            <button className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition">
              Lưu
            </button>
            <button 
              onClick={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev))}
              className="px-6 py-2 bg-[#00b14f] text-white text-sm font-medium rounded hover:bg-[#009e47] transition"
            >
              {currentStep === 4 ? 'Hoàn thành' : 'Tiếp tục'}
            </button>
          </div>

        </div>
      </div>

      {/* ===== DYNAMIC FORM CONTENT ===== */}
      <div className="w-full pt-12">
        {renderStepContent()} 
      </div>

    </div>
  );
};

export default EditEvent;