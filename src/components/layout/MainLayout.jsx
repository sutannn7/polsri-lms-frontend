import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        userName={user?.name}
        userInitials={user?.initials}
      />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 sm:px-8 lg:px-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
