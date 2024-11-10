'use client';

import { useEffect, useState } from 'react';
import { Network, TheGraphNetworksRegistrySchema } from '@/types/registry';
import { NetworkModal } from '@/components/NetworkModal';
import { NetworksContainer } from '@/components/NetworksContainer';

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch('https://graphregistry.pages.dev/TheGraphNetworksRegistry_v0_x_x.json');
        const data = await response.json();
        const parsedData = data as TheGraphNetworksRegistrySchema;
        setNetworks(parsedData.networks);
      } catch (error) {
        console.error('Error fetching networks:', error);
      }
    };

    fetchNetworks();
  }, []);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold">The Graph Blockchain Networks</h1>
        <p className="text-gray-400 mt-2">Explore available blockchain networks</p>
      </header>

      <main className="max-w-7xl mx-auto">
        <NetworksContainer networks={networks} />
      </main>

      {selectedNetwork && (
        <NetworkModal
          network={selectedNetwork}
          onClose={() => setSelectedNetwork(null)}
        />
      )}
    </div>
  );
}
