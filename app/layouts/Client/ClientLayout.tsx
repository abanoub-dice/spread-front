import { Outlet } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';

export default function Layout() {
  return (
    <div className="h-screen w-full bg-gray-100">
      <Navbar
        avatarUrl="https://i.pravatar.cc/150?img=3"
        onChangePassword={() => alert('Change Password')}
        onLogout={() => alert('Logout')}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
