import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
        <p className="text-gray-600 mb-4">Manage your platform settings and users</p>
        <Outlet />
      </div>
    </div>
  );
} 