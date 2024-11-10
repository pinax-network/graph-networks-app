'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Network } from '@/types/registry';
import { NetworkModal } from '@/components/NetworkModal';
import { NetworksContainer } from '@/components/NetworksContainer';

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch('/api/networks');
        const data = await response.json();
        setNetworks(data.networks);
      } catch (error) {
        console.error('Error fetching networks:', error);
      }
    };

    fetchNetworks();
  }, []);
  return (
    <div
      className="min-h-screen text-white p-8 relative flex flex-col"
      style={{
        backgroundImage: 'url("/the-graph-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="inset-0 bg-black/50 fixed" /> {/* Fixed dark overlay */}
      <div className="relative z-10 flex-grow"> {/* Content wrapper with flex-grow */}
        <header className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-2">
            <Image
              src="/the-graph-logo.svg"
              alt="The Graph Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <h1 className="text-4xl font-bold">The Graph Blockchain Networks</h1>
          </div>
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
    </div>
  );
}
