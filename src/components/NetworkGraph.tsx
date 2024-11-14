import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network } from '@/types/registry';

interface NetworkGraphProps {
  isOpen: boolean;
  onClose: () => void;
  networks: Network[];
}

export function NetworkGraph({ isOpen, onClose, networks }: NetworkGraphProps) {
  const graphData = React.useMemo(() => {
    const nodes = networks.map(network => ({
      id: network.id,
      name: network.shortName,
      networkType: network.networkType,
    }));

    const links = networks.flatMap(network =>
      (network.relations || []).map(relation => ({
        source: network.id,
        target: relation.network,
      }))
    );

    return { nodes, links };
  }, [networks]);

  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[80%] h-[90vh]
        bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 z-50
        mx-auto shadow-xl border border-gray-800 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Network Relations Graph</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="w-full h-[calc(100%-3rem)]">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            nodeRelSize={10}
            nodeColor={(node: { networkType: string }) =>
              node.networkType === 'mainnet' ? '#7e22ce' : '#c084fc'
            }
            linkColor={() => '#4c1d95'}
            backgroundColor="rgba(17, 24, 39, 0.8)"
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.1}
          />
        </div>
      </div>
    </div>
  );
}
