export function meta() {
  return [
    { title: "Accounts Management - Spread" },
    { name: "description", content: "Manage platform accounts, billing, and subscription settings with Spread's account management tools" },
  ];
}

export default function Accounts() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Accounts Management</h1>
        <p className="text-gray-600">Manage platform accounts and billing</p>
      </div>
    </div>
  );
} 