import { getNetworkNameAndVariant } from '@/lib/utils';
import { Network } from '@/types/registry';
import { NetworkIcon } from '@web3icons/react';
import { useState, useEffect } from 'react';

interface NetworkModalProps {
  network: Network;
  onClose: () => void;
}

function InfoItem({ label, value, link }: { label: string; value: string; link?: boolean }) {
  if (link) {
    return (
      <div>
        <h3 className="text-gray-400 mb-1">{label}</h3>
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 block truncate"
        >
          {value}
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-gray-400 mb-1">{label}</h3>
      <p className="text-white break-words font-bold">{value}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-gray-400 hover:text-white transition-colors"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );
}

const getProviderServiceName = (provider: string) => {
  switch (provider) {
    case 'e&n': return 'Edge & Node Studio';
    case 'pinax': return 'Pinax';
    case 'streamingfast': return 'StreamingFast';
    case 'messari': return 'Messari';
    case 'graphops': return 'GraphOps';
    default: return provider;
  }
}

export function NetworkModal({ network, onClose }: NetworkModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const getColors = () => {
    return {
      subgraphs: network.services?.subgraphs?.length ? '#66D8FF' : '#4B55634D',
      sps: network.services?.sps?.length ? '#4BCA81' : '#4B55634D',
      substreams: network.services?.substreams?.length ? '#FF79C6' : '#4B55634D',
      firehose: network.services?.firehose?.length ? '#FFA801' : '#4B55634D',
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-xl max-w-3xl w-full p-6 border border-slate-700/30 relative max-h-[90vh] overflow-y-auto overflow-x-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <NetworkIcon
            size={64}
            className="object-contain"
            {...getNetworkNameAndVariant(network)}
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{network.shortName}</h2>
            <p className="text-gray-400">{network.fullName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {network.nativeToken && (
            <InfoItem label="ID" value={network.id} />
          )}
          <InfoItem label="CAIP-2 ID" value={network.caip2Id} />
          {network.explorerUrls && (
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
          {network.docsUrl && (
            <InfoItem label="Documentation" value={network.docsUrl} link />
          )}

          <div className="col-span-full">
            {network.rpcUrls && (
              <div>
                <h3 className="text-gray-400 mb-2">RPC</h3>
                <div className="space-y-2 max-w-full">
                  {network.rpcUrls.map((url, index) => (
                    <div key={index} className="flex items-start max-w-full">
                      <p className="text-white break-all font-mono text-sm inline-flex items-center max-w-full">
                        {url}
                        <CopyButton text={url} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {network.services && (
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-400 mb-2 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: getColors().subgraphs
                      }}
                    />
                    Subgraphs
                  </h3>
                  <div className="space-y-1">
                    {network.services.subgraphs?.map((service, index) => (
                      <p key={index} className="text-white font-bold">
                        {getProviderServiceName(service.provider)}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-400 mb-2 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: getColors().sps
                      }}
                    />
                    Substreams-powered Subgraphs
                  </h3>
                  <div className="space-y-1">
                    {network.services.sps?.map((service, index) => (
                      <p key={index} className="text-white font-bold">
                        {getProviderServiceName(service.provider)}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-400 mb-2 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: getColors().firehose
                      }}
                    />
                    Firehose
                  </h3>
                  <div className="space-y-2 max-w-full">
                    {network.services.firehose?.map((service, index) => (
                      <div key={index}>
                        <p className="text-white break-all font-mono text-sm inline-flex items-center max-w-full">
                          {service.url ?? ''}
                          <CopyButton text={service.url ?? ''} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-400 mb-2 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: getColors().substreams
                      }}
                    />
                    Substreams
                  </h3>
                  <div className="space-y-2 max-w-full">
                    {network.services.substreams?.map((service, index) => (
                      <div key={index}>
                        <p className="text-white break-all font-mono text-sm inline-flex items-center max-w-full">
                          {service.url ?? ''}
                          <CopyButton text={service.url ?? ''} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
