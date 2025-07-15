import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '~/utils/store/hooks/hooks';
import { checkAuth } from '~/utils/store/slices/userSlice';
import { UserType } from '~/utils/interfaces/user';
import Navbar from '../../components/shared/navbar/Navbar';
import Banner from '../../components/client/Banner';

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authenticated, user } = useAppSelector(state => state.user.data);
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

  useEffect(() => {
    if (hasToken) {
      if (!authenticated) {
        dispatch(checkAuth());
        return;
      }
      if (authenticated && user && user.role !== UserType.CLIENT) {
        navigate(`/dicer`, { replace: true });
      }
    } else {
      navigate('/client/login', { replace: true });
      return;
    }
  }, [hasToken, authenticated, user, navigate, dispatch]);

  if (!authenticated) return null;

  return (
    <div className="h-screen w-full">
      <Navbar avatarUrl="https://i.pravatar.cc/150?img=3" onLogout={() => alert('Logout')} />
      <Banner />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
