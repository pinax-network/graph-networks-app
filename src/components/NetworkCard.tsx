import type { Network } from '@pinax/graph-networks-registry';
import { NetworkIcon } from '@web3icons/react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getNetworkNameAndVariant } from '@/lib/utils';

interface NetworkCardProps {
  network: Network;
  onClick: () => void;
}

const SERVICE_INDICATORS = [
  { key: 'subgraphs', color: '#66D8FF', hoverText: 'Subgraph in Studio' },
  // {
  //   key: 'sps',
  //   color: '#4C66FF',
  //   hoverText: 'Substreams-powered Subgraphs in Studio',
  // },
  { key: 'substreams', color: '#FF79C6', hoverText: 'Substreams' },
  { key: 'firehose', color: '#FFA801', hoverText: 'Firehose' },
  { key: 'tokenApi', color: '#4BCA81', hoverText: 'Token API' },
] as const;

export function NetworkCard({ network, onClick }: NetworkCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (['Enter', 'Space'].includes(e.key)) {
          onClick();
        }
      }}
      className="bg-slate-800 rounded-lg p-6 cursor-pointer hover:bg-slate-700 transition-colors relative border border-slate-700/30"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 -ml-2">
          <NetworkIcon
            size={64}
            className="object-contain"
            {...getNetworkNameAndVariant(network)}
          />
          {network.issuanceRewards && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  <div className="absolute -bottom-2 -right-2">
                    <Image
                      src="/the-graph-token-light.svg"
                      alt="GRT Token"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Indexing Rewards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div>
          <h3 className="text-xl text-white">
            <span className="font-extrabold">{network.shortName}</span>{' '}
            <span className="font-extralight">{network.secondName ?? ''}</span>
          </h3>
          <p className="text-gray-400">{network.fullName}</p>
        </div>
      </div>

      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {SERVICE_INDICATORS.map(({ key, color, hoverText }) => (
          <TooltipProvider key={key}>
            <Tooltip delayDuration={200}>
              <TooltipTrigger>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: network.services?.[key as keyof typeof network.services]
                      ?.length
                      ? color
                      : '#494755',
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{hoverText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
