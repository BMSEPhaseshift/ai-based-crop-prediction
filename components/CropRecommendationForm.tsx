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

    // Construct the input array in the required order
    const inputArray = [
      formData.get("region"),
      Number(formData.get("temperature")),
      Number(formData.get("humidity")),
      Number(formData.get("rainfall")),
      formData.get("soilType"),
      Number(formData.get("soilQualityIndex")),
    ];

    const data = { input: inputArray }; // Wrap the array in an object with the key "input"

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Send data in the required format
      });
      console.log(JSON.stringify(data)); // Log the sent data for debugging
      const result = await response.json();
      console.log(result); // Log the result after the API call
      setResult(result); // Update state with the received recommendation
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
      
      {/* Conditionally render the RecommendationResult component if result exists */}
      {result && <RecommendationResult recommendation={result} />}
    </div>
  );
}
