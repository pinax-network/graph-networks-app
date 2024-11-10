import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://graphregistry.pages.dev/TheGraphNetworksRegistry_v0_x_x.json"
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching networks:", error);
    return NextResponse.json(
      { error: "Failed to fetch networks" },
      { status: 500 }
    );
  }
}
