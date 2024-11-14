import { useState } from 'react';
import { Network } from '@/types/registry';
import { NetworkCard } from './NetworkCard';
import { NetworkDrawer } from './NetworkDrawer';
import { Switch } from '@/components/ui/switch';
import { NetworkCount } from '@/app/api/subgraphs/route';

interface FilterToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  id: string;
}

function FilterToggle({ checked, onCheckedChange, label, id }: FilterToggleProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
      />
      <label
        htmlFor={id}
        className={`text-sm cursor-pointer ${
          checked
            ? "text-white font-medium"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function NetworksContainer({ networks, subgraphCounts }: { networks: Network[]; subgraphCounts: NetworkCount[] }) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(undefined);
  const [showTestnets, setShowTestnets] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subgraphs: false,
    sps: false,
    firehose: false,
    substreams: false,
  });

  const filteredNetworks = networks
    .filter(network => {
      // First apply search filter
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        const matchesSearch =
          network.fullName.toLowerCase().includes(search) ||
          network.caip2Id.toLowerCase().includes(search) ||
          network.id.toLowerCase().includes(search);

        if (!matchesSearch) return false;
      }

      // Then apply testnet filter
      if (!showTestnets && network.networkType === 'testnet') {
        return false;
      }

      // Then apply service filters
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activeFilters = Object.entries(filters).filter(([_, value]) => value);
      if (activeFilters.length === 0) {
        return true;
      }

      // Check if network matches ALL active service filters
      return activeFilters.every(([service]) =>
        network.services?.[service as keyof typeof network.services]?.length ?? 0 > 0
      );
    })
    .sort((a, b) => {
      if (a.issuanceRewards !== b.issuanceRewards) {
        return b.issuanceRewards ? 1 : -1;
      }
      // Count supported services for each network
      const countServices = (network: Network) => {
        return ['subgraphs', 'sps', 'firehose', 'substreams'].reduce((count, service) => {
          return count + (network.services?.[service as keyof typeof network.services]?.length ? 1 : 0);
        }, 0);
      };

      const servicesA = countServices(a);
      const servicesB = countServices(b);

      // Sort by number of services (descending)
      return servicesB - servicesA;
    });

  return (
    <>
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex-grow max-w-md relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-1.5 bg-slate-800/50 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 text-white placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <FilterToggle
          checked={showTestnets}
          onCheckedChange={setShowTestnets}
          label="Testnets"
          id="testnet-toggle"
        />
        <FilterToggle
          checked={filters.subgraphs}
          onCheckedChange={(checked) => setFilters(f => ({ ...f, subgraphs: checked }))}
          label="Subgraphs"
          id="subgraphs-toggle"
        />
        <FilterToggle
          checked={filters.sps}
          onCheckedChange={(checked) => setFilters(f => ({ ...f, sps: checked }))}
          label="SpS"
          id="sps-toggle"
        />
        <FilterToggle
          checked={filters.firehose}
          onCheckedChange={(checked) => setFilters(f => ({ ...f, firehose: checked }))}
          label="Firehose"
          id="firehose-toggle"
        />
        <FilterToggle
          checked={filters.substreams}
          onCheckedChange={(checked) => setFilters(f => ({ ...f, substreams: checked }))}
          label="Substreams"
          id="substreams-toggle"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNetworks.map((network) => (
          <NetworkCard
            key={network.id}
            network={network}
            onClick={() => setSelectedNetwork(network)}
          />
        ))}
        <a
            href="https://github.com/graphprotocol/networks-registry"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
        >
            <NetworkCard
                key="missing_chain"
                network={{
                    id: "missing_chain",
                    shortName: "Missing a chain?",
                    fullName: "Add it to the Registry!",
                    caip2Id: "",
                    networkType: "mainnet",
                    services: {},
                    issuanceRewards: false,
                }}
                onClick={() => {}}
            />
        </a>
      </div>

      { selectedNetwork &&
        <NetworkDrawer
          network={selectedNetwork}
          subgraphCounts={subgraphCounts?.find((count) => count.network === selectedNetwork?.id)}
          onClose={() => setSelectedNetwork(undefined)}
          isOpen={selectedNetwork !== null}
        />
      }
    </>
  );
}
