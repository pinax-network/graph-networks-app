import { Network } from '@/types/registry';
import { NetworkIcon } from '@web3icons/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NetworkCardProps {
  network: Network;
  onClick: () => void;
}

const SERVICE_INDICATORS = [
  { key: 'subgraphs', color: '#66D8FF', hoverText: 'Subgraph in Studio' },
  { key: 'sps', color: '#4BCA81', hoverText: 'Substreams-powered Subgraphs in Studio' },
  { key: 'substreams', color: '#FF79C6', hoverText: 'Substreams' },
  { key: 'firehose', color: '#FFA801', hoverText: 'Firehose' },
] as const;

function getNetworkNameAndVariant(network: Network) {
  return network.icon?.web3Icons ? {
    network: network.icon.web3Icons.name,
    variant: network.icon.web3Icons.variants?.length === 1 && network.icon.web3Icons.variants[0] === 'mono' ? 'mono' : 'branded'
  } as const : {
    network: 'ethereum',
    variant: 'mono'
  } as const;
}

export function NetworkCard({ network, onClick }: NetworkCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors relative"
    >
      <div className="flex items-center gap-4">
        <NetworkIcon
          size={64}
          className="object-contain"
          {...getNetworkNameAndVariant(network)}
        />
        <div>
          <h3 className="text-xl font-bold text-white">{network.shortName}</h3>
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
                    backgroundColor: network.services?.[key as keyof typeof network.services]?.length
                      ? color
                      : '#4B55634D'
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
