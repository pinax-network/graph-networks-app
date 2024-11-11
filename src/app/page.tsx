'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Network } from '@/types/registry';
import { NetworkModal } from '@/components/NetworkModal';
import { NetworksContainer } from '@/components/NetworksContainer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/networks');
        const data = await response.json();
        setNetworks(data.networks);
      } catch (error) {
        console.error('Error fetching networks:', error);
      } finally {
        setIsLoading(false);
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Image
                src="/the-graph-logo.svg"
                alt="The Graph Logo"
                width={64}
                height={64}
                className="h-16 w-16"
              />
              <h1 className="text-4xl font-bold">The Graph Networks</h1>
            </div>
            <div className="text-right">
              <div className="text-[80px] font-bold text-[#F8F6FF] leading-none">
                {networks.length}+
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px] mt-[420px] ml-[-4px]">
              <Loader2 className="h-32 w-32 animate-spin text-white" />
            </div>
          ) : (
            <NetworksContainer networks={networks} />
          )}
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
