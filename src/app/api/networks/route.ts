import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Pinned to the schema minor that @pinax/graph-networks-registry parses: a
    // new minor can change the shape (0.8 turned services.subgraphs into
    // objects). The registry keeps every minor up to date, so bump this with
    // the package.
    const response = await fetch(
      'https://networks-registry.thegraph.com/TheGraphNetworksRegistry_v0_9_x.json',
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
