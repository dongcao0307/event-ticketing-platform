import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import EventCard from '../../components/home/EventCard';
import { getFavoriteEvents } from '../../services/eventService';

const FavoriteEventsPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavoriteEvents();
        setFavorites(data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện yêu thích:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#26bc71] border-t-transparent rounded-full animate-spin" />
          <span>Đang tải danh sách yêu thích...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#2f3d37] pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="text-[#26bc71] fill-[#26bc71]" size={24} />
          Sự kiện yêu thích
        </h2>
        {favorites.length > 0 && (
          <span className="text-sm text-gray-400">
            {favorites.length} sự kiện
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-[#12201b]/30 rounded-2xl border border-dashed border-[#2f3d37]">
          <div className="w-16 h-16 rounded-full bg-[#1f2b25] flex items-center justify-center mb-4 text-[#26bc71] animate-pulse">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Danh sách yêu thích trống</h3>
          <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
            Bạn chưa lưu sự kiện nào vào danh sách yêu thích của mình. Hãy khám phá và lưu lại những sự kiện thú vị nhé!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-[#26bc71] hover:bg-[#1fa86a] text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#26bc71]/20"
          >
            Khám phá sự kiện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {favorites.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteEventsPage;
