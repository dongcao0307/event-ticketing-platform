import React from 'react';
import { Eye, Check, X } from 'lucide-react';

const typeBadge = (type) =>
  type === 'Offline' ? (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/10 text-orange-500">
      Offline
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500">
      Online
    </span>
  );

const statusBadge = (status) => {
  const map = {
    Pending:  'bg-yellow-500/10 text-yellow-500',
    Approved: 'bg-green-500/10 text-green-500',
    Rejected: 'bg-red-500/10 text-red-500',
  };
  const labels = { Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Bị từ chối' };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${map[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
};

const EventTable = ({ events, onView, onApprove, onReject }) => (
  <div className="bg-[#222] rounded-xl border border-white/5 overflow-hidden">
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-[#1a1a1a] text-gray-500 font-medium">
          <th className="px-6 py-4">Tên sự kiện</th>
          <th className="px-6 py-4">Người tạo</th>
          <th className="px-6 py-4">Loại</th>
          <th className="px-6 py-4">Thời gian</th>
          <th className="px-6 py-4">Giá vé</th>
          <th className="px-6 py-4">Ngày tạo</th>
          <th className="px-6 py-4">Trạng thái</th>
          <th className="px-6 py-4">Hành động</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {events.map((event, idx) => (
          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
            <td className="px-6 py-5 font-medium text-white">{event.name}</td>
            <td className="px-6 py-5 text-gray-400">{event.creator}</td>
            <td className="px-6 py-5">{typeBadge(event.type)}</td>
            <td className="px-6 py-5 text-gray-400 whitespace-nowrap">{event.time}</td>
            <td className="px-6 py-5 text-gray-400">{event.price}</td>
            <td className="px-6 py-5 text-gray-400 whitespace-nowrap">{event.created}</td>
            <td className="px-6 py-5">{statusBadge(event.status)}</td>
            <td className="px-6 py-5">
              <div className="flex gap-3 text-gray-500">
                <Eye    size={16} onClick={() => onView?.(event)}    className="hover:text-white cursor-pointer transition-colors" />
                <Check  size={16} onClick={() => onApprove?.(event)} className="hover:text-[#26bc71] cursor-pointer transition-colors" />
                <X      size={16} onClick={() => onReject?.(event)}  className="hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EventTable;
