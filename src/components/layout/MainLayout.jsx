import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout({
  userName,
  userInitials,
  onSearchChange,
  searchValue,
  onNotificationClick,
  onProfileClick,
}) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        userName={userName ?? user?.name}
        userInitials={userInitials ?? user?.initials}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        onNotificationClick={onNotificationClick}
        onProfileClick={onProfileClick}
      />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 sm:px-8 lg:px-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
