"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecommendationResult from "@/components/RecommendationResult"; // Updated import for default export
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { soilTypes, states } from "@/lib/constants";
import { CropRecommendation } from "@/lib/types";

export function CropRecommendationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      region: formData.get("region"),
      temperature: Number(formData.get("temperature")),
      rainfall: Number(formData.get("rainfall")),
      humidity: Number(formData.get("humidity")),
      soilType: formData.get("soilType"),
      soilQualityIndex: Number(formData.get("soilQualityIndex")),
    };

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <SelectField
              id="region"
              label="Region (State)"
              options={states}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="temperature"
                label="Temperature (°C)"
                type="number"
                placeholder="Enter temperature"
                required
                step={0.1}
              />

              <InputField
                id="rainfall"
                label="Rainfall (mm)"
                type="number"
                placeholder="Enter rainfall"
                required
                step={0.1}
              />
            </div>

            <InputField
              id="humidity"
              label="Humidity (%)"
              type="number"
              placeholder="Enter humidity"
              required
              min={0}
              max={100}
            />

            <SelectField
              id="soilType"
              label="Soil Type"
              options={soilTypes}
              required
            />

            <InputField
              id="soilQualityIndex"
              label="Soil Quality Index (0-100)"
              type="number"
              placeholder="Enter soil quality index"
              required
              min={0}
              max={100}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Analyzing..." : "Get Recommendation"}
          </Button>
        </form>
      </Card>

      {result && <RecommendationResult recommendation={result} />}
    </div>
  );
}
