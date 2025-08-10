export function meta() {
  return [
    { title: "Content Manager - Spread" },
    { name: "description", content: "Create, edit, and manage your social media content with Spread's powerful content management tools" },
  ];
}

export default function ContentManager() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Content Manager</h1>
        <p className="text-gray-600">Create and manage your content</p>
      </div>
    </div>
  );
} 