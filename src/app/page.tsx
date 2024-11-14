'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Network } from '@/types/registry';
import { NetworksContainer } from '@/components/NetworksContainer';
import { Loader2 } from 'lucide-react';
import { NetworkCount } from './api/subgraphs/route';
import { NetworkGraph } from '@/components/NetworkGraph';

export default function Home() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [subgraphCounts, setSubgraphCounts] = useState<NetworkCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState('0.0.0');
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [networksResponse, subgraphsResponse] = await Promise.all([
          fetch('/api/networks'),
          fetch('/api/subgraphs')
        ]);

        const networksData = await networksResponse.json();
        const subgraphsData = await subgraphsResponse.json();
        setNetworks(networksData.networks);
        setSubgraphCounts(subgraphsData);
        setVersion(networksData.version);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      <div className="inset-0 bg-black/50 fixed" />
      <div className="relative z-10 flex-grow">
        <header className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <Image
                  src="/the-graph-logo.svg"
                  alt="The Graph Logo"
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold">The Graph Networks</h1>
                  <div className="text-sm text-gray-300/80 mt-1">
                    powered by{' '}
                    <a
                      href={`https://github.com/graphprotocol/networks-registry/releases/tag/v${version}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white text-gray-300 transition-colors"
                    >
                      The Graph Networks Registry v{version}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {networks.length > 0 && (
                <button
                  onClick={() => setIsGraphOpen(true)}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Network Graph
                </button>
              )}
              { networks.length > 0 && (
                <div className="hidden sm:block text-right">
                  <div className="text-[50px] font-bold text-[#F8F6FF] leading-none">
                    {networks.length}
                  </div>
                  <div className="text-l text-gray-300/80">networks</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          { isLoading ? (
            <div className="fixed inset-0 flex items-center justify-center -mt-[62px] -ml-[4px]">
              <Loader2 className="h-32 w-32 animate-spin text-white" />
            </div>
          ) : (
            <NetworksContainer networks={networks} subgraphCounts={subgraphCounts} />
          )}
        </main>
      </div>
      <NetworkGraph
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        networks={networks}
      />
    </div>
  );
}
