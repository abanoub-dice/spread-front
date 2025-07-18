import React from 'react';
import { useParams } from 'react-router-dom';

export default function PostView() {
  const { id } = useParams();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Post View</h1>
        <p className="text-gray-600 mb-2">Reading post with ID: {id}</p>
        <p className="text-gray-600">View and edit your content</p>
      </div>
    </div>
  );
} 