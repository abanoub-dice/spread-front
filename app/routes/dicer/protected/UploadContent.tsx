export function meta() {
  return [
    { title: "Upload Content - Spread" },
    { name: "description", content: "Upload and manage your media content with Spread's easy-to-use content upload tools" },
  ];
}

export default function UploadContent() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Upload Content</h1>
        <p className="text-gray-600">Upload and manage your media content</p>
      </div>
    </div>
  );
} 