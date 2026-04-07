import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyAccountPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1412] text-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:px-8">
        <div className="bg-[#151f1b] rounded-2xl border border-[#2f3d37] shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <aside className="border-b border-gray-700 lg:border-b-0 lg:border-r border-r-transparent p-5 lg:p-6 bg-[#12201b]">
              <h3 className="text-lg font-bold text-white mb-4">Tài khoản của tôi</h3>
              <nav className="flex flex-col gap-2">
                <NavLink
                  to="settings"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm ${isActive ? 'bg-[#26bc71] text-black' : 'bg-[#1f2b25] text-gray-200 hover:bg-[#25342f]'}`
                  }
                  end
                >
                  Cài đặt tài khoản
                </NavLink>
                <NavLink
                  to="tickets"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm ${isActive ? 'bg-[#26bc71] text-black' : 'bg-[#1f2b25] text-gray-200 hover:bg-[#25342f]'}`
                  }
                >
                  Vé của tôi
                </NavLink>
              </nav>
            </aside>

            <section className="lg:col-span-3 p-5 lg:p-6">
              <Outlet />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAccountPage;
