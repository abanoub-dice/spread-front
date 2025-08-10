import React from 'react';

export function meta() {
  return [
    { title: "Page Not Found - Spread" },
    { name: "description", content: "The page you are looking for does not exist. Please check the URL or navigate back to Spread's main page." },
  ];
}

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '10vh' }}>
    <h1>404</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
  </div>
);

export default NotFound; 