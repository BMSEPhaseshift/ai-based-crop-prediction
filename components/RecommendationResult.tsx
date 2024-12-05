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

      <div className="space-y-6">
        {/* Recommended Crop Section */}
        <div className="flex items-center gap-4">
          <Sprout className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-semibold text-lg">Recommended Crop</h3>
            <p className="text-xl text-green-600">
              {recommendation.recommendedCrop ||
                "No crop recommendation available"}
            </p>
          </div>
        </div>

        {/* Sustainability Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Sustainability Score</span>
            <span className="text-green-600">
              {recommendation.sustainabilityScore ?? 0}%
            </span>
          </div>
          <Progress
            value={recommendation.sustainabilityScore || 0}
            className="h-2"
          />
        </div>

        {/* Sustainable Practices */}
        <div className="space-y-4">
          <h3 className="font-semibold">Sustainable Agricultural Practices:</h3>
          <ul className="space-y-2">
            {recommendation.practices?.length ? (
              recommendation.practices.map((practice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{practice}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-600">
                No sustainable agricultural practices available.
              </p>
            )}
          </ul>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expected Yield Increase */}
          <div className="flex items-center gap-2">
            <ThermometerSun className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Expected Yield Increase</p>
              <p className="font-semibold">
                {recommendation.expectedYieldIncrease ?? 0}%
              </p>
            </div>
          </div>

          {/* Water Efficiency */}
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Water Efficiency</p>
              <p className="font-semibold">
                {recommendation.waterEfficiency ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
