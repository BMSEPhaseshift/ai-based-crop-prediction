"use client";

import { CropRecommendationForm } from "@/components/CropRecommendationForm";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <CropRecommendationForm />
      </div>
    </main>
  );
}
