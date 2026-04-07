import React, { useState, useEffect, useRef } from 'react';
import { Mail, MoreVertical, Eye, Edit3, Lock, Unlock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const AVATAR_COLORS = ['#0d9488','#059669','#047857','#0e7490','#065f46','#0f766e'];

const ActionMenu = ({ user, onAction, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-10 top-0 z-50 w-48 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-2xl py-1"
    >
      <button onClick={() => onAction('view', user)}   className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Eye size={14} /> Xem chi tiết</button>
      <button onClick={() => onAction('edit', user)}   className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Edit3 size={14} /> Chỉnh sửa</button>
      <button onClick={() => onAction('toggle', user)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
        {user.status === 'Hoạt động' ? <Lock size={14} /> : <Unlock size={14} />}
        {user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}
      </button>
      <div className="border-t border-white/5 my-1" />
      <button onClick={() => onAction('delete', user)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /> Xóa tài khoản</button>
    </div>
  );
};

const UserTable = ({ users, selectedIds, onSelectAll, onSelectOne, onAction, sortOrder, onSortToggle }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const cbRef = useRef(null);

  const allSelected  = users.length > 0 && users.every((u) => selectedIds.has(u.id));
  const someSelected = users.some((u) => selectedIds.has(u.id)) && !allSelected;
  useEffect(() => { if (cbRef.current) cbRef.current.indeterminate = someSelected; }, [someSelected]);

  const handleAction = (action, user) => { setOpenMenuId(null); onAction?.(action, user); };

  return (
    <div className="bg-[#222] rounded-xl border border-white/5 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-[#1a1a1a] text-gray-500 font-medium">
            <th className="pl-6 pr-2 py-4 w-10">
              <input ref={cbRef} type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} className="accent-[#26bc71] w-4 h-4 cursor-pointer" />
            </th>
            <th className="px-6 py-4">Họ và tên</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Số điện thoại</th>
            <th className="px-6 py-4">
              <button onClick={onSortToggle} className="flex items-center gap-1 hover:text-white transition-colors">
                Ngày tạo {sortOrder === 'desc' ? <ChevronDown size={13}/> : <ChevronUp size={13}/>}
              </button>
            </th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="pl-6 pr-2 py-5">
                <input type="checkbox" checked={selectedIds.has(user.id)} onChange={(e) => onSelectOne(user.id, e.target.checked)} className="accent-[#26bc71] w-4 h-4 cursor-pointer" />
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: AVATAR_COLORS[user.id % AVATAR_COLORS.length] }}
                  >
                    {user.initials}
                  </div>
                  <span className="font-medium text-white whitespace-nowrap">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={13} className="shrink-0 text-gray-600" />
                  <span>{user.email}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-gray-400 whitespace-nowrap">{user.phone}</td>
              <td className="px-6 py-5 text-gray-400 whitespace-nowrap">{user.created}</td>
              <td className="px-6 py-5">
                {user.status === 'Hoạt động' ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#26bc71] shrink-0" />
                    <span className="text-[#26bc71] text-sm">Hoạt động</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-red-400 text-sm">Bị khóa</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-5 relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {openMenuId === user.id && (
                  <ActionMenu user={user} onAction={handleAction} onClose={() => setOpenMenuId(null)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
