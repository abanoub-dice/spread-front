import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
