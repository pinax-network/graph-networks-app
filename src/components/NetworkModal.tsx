import { Network } from '@/types/registry';
import Image from 'next/image';

interface NetworkModalProps {
  network: Network;
  onClose: () => void;
}

export function NetworkModal({ network, onClose }: NetworkModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4 mb-6">
          {network.icon?.web3Icons && (
            <div className="w-16 h-16 relative">
              <Image
                src={`/icons/${network.icon.web3Icons.name}.svg`}
                alt={network.fullName}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">{network.fullName}</h2>
            <p className="text-gray-400">{network.shortName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <InfoItem label="Chain ID" value={network.caip2Id} />
          {network.nativeToken && (
            <InfoItem label="Native Token" value={network.nativeToken} />
          )}
          {network.explorerUrls && network.explorerUrls.length > 0 && (
            <div>
              <h3 className="text-gray-400 mb-2">Block Explorers</h3>
              <div className="space-y-2">
                {network.explorerUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block truncate"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-gray-400 mb-1">{label}</h3>
      <p className="text-white">{value}</p>
    </div>
  );
}
