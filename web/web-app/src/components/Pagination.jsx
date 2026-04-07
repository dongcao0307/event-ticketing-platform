import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-1 py-6 mt-2">
      <p className="text-gray-500 text-sm">
        Hiển thị{' '}
        <span className="text-white font-medium">{from}–{to}</span>
        {' '}/{' '}
        <span className="text-white font-medium">{totalItems}</span> sự kiện
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#26bc71] text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Tiếp
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
