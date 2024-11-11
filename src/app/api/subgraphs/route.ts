import { NextResponse } from "next/server";

const BATCH_SIZE = 1000; // Number of records to fetch per request
const CACHE_TTL = 60 * 60; // Cache for 1 hour
type SubgraphResponse = {
  subgraphDeployments: {
    manifest: {
      network: string;
      poweredBySubstreams: boolean;
    };
  }[];
};

export type NetworkCount = {
  network: string;
  subgraphsCount: number;
  spsCount: number;
};

async function fetchAllSubgraphs(
  apiKey: string
): Promise<SubgraphResponse["subgraphDeployments"]> {
  const allDeployments: SubgraphResponse["subgraphDeployments"] = [];
  let hasMore = true;
  let skip = 0;

  while (hasMore) {
    const query = `{
      subgraphDeployments(
        first: ${BATCH_SIZE},
        skip: ${skip},
        orderBy: createdAt,
        where: {activeSubgraphCount_gt: 0}
      ) {
        manifest {
          network
          poweredBySubstreams
        }
      }
    }`;

    const response = await fetch(
      `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        next: { revalidate: CACHE_TTL }, // Cache for 1 hour
      }
    );

    const data: { data: SubgraphResponse } = await response.json();
    const deployments = data.data?.subgraphDeployments ?? [];

    allDeployments.push(...deployments);

    if (deployments.length < BATCH_SIZE) {
      hasMore = false;
    }
    skip += BATCH_SIZE;
  }

  return allDeployments;
}

function countNetworks(
  deployments: SubgraphResponse["subgraphDeployments"]
): NetworkCount[] {
  const networkCounts = new Map<string, { total: number; sps: number }>();

  deployments.forEach((deployment) => {
    const network = deployment.manifest.network;
    const current = networkCounts.get(network) || { total: 0, sps: 0 };

    current.total += 1;
    if (deployment.manifest.poweredBySubstreams) {
      current.sps += 1;
    }

    networkCounts.set(network, current);
  });

  return Array.from(networkCounts.entries()).map(([network, counts]) => ({
    network,
    subgraphsCount: counts.total,
    spsCount: counts.sps,
  }));
}

export async function GET() {
  try {
    const apiKey = process.env.GRAPH_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const deployments = await fetchAllSubgraphs(apiKey);
    const networkCounts = countNetworks(deployments);

    return NextResponse.json(networkCounts, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error("Error fetching subgraph counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch subgraph counts" },
      { status: 502 }
    );
  }
}
