import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://networks-registry.thegraph.com/TheGraphNetworksRegistry_v0_x_x.json',
      {
        next: { revalidate: 5 * 60 }, // Cache for 5 minutes
      },
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching networks:', error);
    return NextResponse.json({ error: 'Failed to fetch networks' }, { status: 502 });
  }
}
