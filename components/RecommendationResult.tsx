import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CropRecommendation } from "@/lib/types";
import { Sprout, Droplets, ThermometerSun } from "lucide-react";

interface RecommendationResultProps {
  recommendation: CropRecommendation | null; // Allow null for initial loading state
}

export default function RecommendationResult({
  recommendation,
}: RecommendationResultProps) {
  if (!recommendation) {
    return (
      <Card className="p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recommendation Results
        </h2>
        <p>Loading recommendation...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Recommendation Results
      </h2>
      {/* Existing code for rendering the recommendation results */}
    </Card>
  );
}

export async function getServerSideProps(context: any) {
  try {
    // Fetch the recommendation data from the server-side route
    const response = await fetch(
      "/api/recommend?${new URLSearchParams(context.query)}"
    );
    const recommendation = await response.json();

    return {
      props: {
        recommendation,
      },
    };
  } catch (error) {
    console.error("Error fetching recommendation data:", error);
    return {
      props: {
        recommendation: null,
      },
      status: 500,
    };
  }
}
