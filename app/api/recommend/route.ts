import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Extract any necessary parameters from the request
    const { searchParams } = new URL(request.url);
    const data = Object.fromEntries(searchParams);

    // Call the external Python API with the data
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Python API");
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
