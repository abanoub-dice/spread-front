export function meta() {
  return [
    { title: "Clients Management - Spread" },
    { name: "description", content: "Manage client accounts, permissions, and settings with Spread's client management tools" },
  ];
}

export default function Clients() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Clients Management</h1>
        <p className="text-gray-600">Manage client accounts and permissions</p>
      </div>
    </div>
  );
} 