export function meta() {
  return [
    { title: "Social Analytics - Spread" },
    { name: "description", content: "Track social media performance and engagement metrics with Spread's comprehensive analytics dashboard" },
  ];
}

export default function SocialAnalytics() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Social Analytics</h1>
        <p className="text-gray-600">Social media performance and engagement metrics</p>
      </div>
    </div>
  );
} 