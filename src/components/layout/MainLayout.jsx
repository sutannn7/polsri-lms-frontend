import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout() {
  const { user } = useAuth();
  const mainRef = useRef(null);

  // Moving focus to the page heading when the app area appears (i.e. right
  // after signing in) so keyboard and screen-reader users land on the new
  // content instead of the top of the document. Mount only: hopping between
  // the app's own pages leaves focus where the user put it.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const target = main.querySelector('h1') ?? main;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        userName={user?.name}
        userInitials={user?.initials}
      />
      <main
        ref={mainRef}
        className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 sm:px-8 lg:px-0"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
