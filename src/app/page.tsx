'use client';

import useSWR from 'swr';
import Image from 'next/image';
import { NetworksRegistry } from '@pinax/graph-networks-registry';
import { NetworksContainer } from '@/components/NetworksContainer';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import React from 'react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return await res.text();
};

function useNetworks() {
  const { data, error, isLoading } = useSWR('/api/networks', fetcher);
  const networksData = data ? NetworksRegistry.fromJson(data) : null;
  return {
    networks: networksData?.networks ?? [],
    version: networksData?.version ?? '0.0.0',
    isLoading,
    error,
  };
}

function useSubgraphs() {
  const { data, error, isLoading } = useSWR('/api/subgraphs', fetcher);
  return {
    subgraphCounts: JSON.parse(data || '[]'),
    isLoading,
    error,
  };
}

export default function Home() {
  const { networks, version, isLoading, error: networksError } = useNetworks();
  const { subgraphCounts, error: subgraphsError } = useSubgraphs();

  React.useEffect(() => {
    if (networksError) {
      toast.error(`Failed to fetch networks data: ${networksError}`);
    }
    if (subgraphsError) {
      toast.error(`Failed to fetch subgraphs data: ${subgraphsError}`);
    }
  }, [networksError, subgraphsError]);

  return (
    <div
      className="min-h-screen text-white p-8 relative flex flex-col"
      style={{
        backgroundImage: 'url("/the-graph-background.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Toaster position="top-right" theme="dark" />
      <div className="inset-0 bg-black/50 fixed" />
      <div className="relative z-10 grow">
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
            {networks.length > 0 && (
              <div className="hidden sm:block text-right">
                <div className="text-[50px] font-bold text-[#F8F6FF] leading-none">
                  {networks?.length}
                </div>
                <div className="text-l text-gray-300/80">networks</div>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="fixed inset-0 flex items-center justify-center -mt-[62px] -ml-[4px]">
              <Loader2 className="h-32 w-32 animate-spin text-white" />
            </div>
          ) : (
            <NetworksContainer networks={networks} subgraphCounts={subgraphCounts} />
          )}
        </main>
      </div>
    </div>
  );
}
