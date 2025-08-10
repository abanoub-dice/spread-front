import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '~/utils/store/zustandHooks';
import { UserType } from '~/utils/interfaces/user';
import Navbar from '../../components/shared/navbar/Navbar';
import Banner from '../../components/client/Banner';

export default function Layout() {
  const navigate = useNavigate();
  const { authenticated, user, checkAuth } = useUserStore();
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

  useEffect(() => {
    if (hasToken) {
      if (!authenticated) {
        checkAuth();
        return;
      }
      if (authenticated && user && user.type !== UserType.CLIENT) {
        navigate(`/dicer`, { replace: true });
      }
    } else {
      navigate('/client/login', { replace: true });
      return;
    }
  }, [hasToken, authenticated, user, navigate, checkAuth]);

  if (!authenticated) return null;

  return (
    <div className="h-screen w-full bg-[#f7f9fa]">
      <Navbar avatarUrl="https://i.pravatar.cc/150?img=3" onLogout={() => alert('Logout')} />
      <Banner />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
