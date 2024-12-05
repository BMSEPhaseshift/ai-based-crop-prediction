import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Crop Advisor</h1>
            <p className="text-sm text-gray-600">Sustainable Agriculture Solutions</p>
          </div>
        </div>
      </div>
    </header>
  );
}