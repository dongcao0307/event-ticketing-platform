import React from 'react';
// Không cần dùng useState hay useEffect nữa, code sẽ gọn và nhanh hơn rất nhiều!
import EventSidebar from '../components/EventSidebar'; 
import EventHeader from '../components/EventHeader';
import { useSearchParams } from 'react-router-dom';

// Import tất cả các Component con
import Overview from './event/Overview';
import Analytics from './event/Analytics';
import Orders from './event/Orders';
import EditEvent from './event/EditEvent';
import Voucher from './event/Voucher';

const EventPage = () => {
  // Lấy cả searchParams và hàm setSearchParams để cập nhật URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Lấy tab hiện tại thẳng từ URL, nếu không có thì mặc định là 'overview'
  const activeTab = searchParams.get('tab') || 'overview';

  // Hàm đổi tab: Thay vì lưu vào state ảo, ta cập nhật thẳng lên URL
  // Lúc này EventSidebar gọi hàm này, URL sẽ đổi -> Giao diện tự động cập nhật!
  const setActiveTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  // Hàm quyết định hiển thị Component nào dựa vào URL
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'orders':
        return <Orders />;
      case 'edit':
        return <EditEvent />;
      case 'voucher':
        return <Voucher />;
      default:
        return <Overview />;
    }
  };

  return (
    // Layout bọc ngoài cùng: Khóa cuộn màn hình, nền tối
    <div className="flex h-screen w-full bg-[#0e0e0e] overflow-hidden font-sans">
      
      {/* Cột trái: Sidebar chuyên biệt cho Event */}
      <EventSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Cột phải: Chứa Header và Nội dung */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header chuyên biệt cho Event */}
        <EventHeader />

        {/* Khu vực thay đổi nội dung linh hoạt */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0e0e0e]">
          
          {/* Nhúng hàm render động vào đây */}
          {renderTabContent()}
          
        </main>
        
      </div>
    </div>
  );
};

export default EventPage;