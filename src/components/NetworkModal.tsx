import { getNetworkNameAndVariant } from '@/lib/utils';
import { Network } from '@/types/registry';
import { NetworkIcon } from '@web3icons/react';
import { useState, useEffect } from 'react';

interface NetworkModalProps {
  network: Network;
  subgraphCounts?: { subgraphsCount: number; spsCount: number };
  onClose: () => void;
}

function InfoLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-gray-400 mb-1">{children}</h3>;
}

function InfoText({ children, bold = false }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <p className={`text-white break-words ${bold ? 'font-bold' : ''}`}>
      {children}
    </p>
  );
}

function InfoLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
    >
      <span className="truncate">{children}</span>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function InfoCode({ text }: { text: string }) {
  return (
    <p className="text-white break-all font-mono text-sm inline-flex items-center max-w-full">
      {text}
      <CopyButton text={text} />
    </p>
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

interface ServiceSectionProps {
  title: string;
  color: string;
  services?: Array<{ provider: string; url?: string }>;
  showUrl?: boolean;
}

function ServiceSection({ title, color, services = [], showUrl = false }: ServiceSectionProps) {

  return (
    <div>
      <h3 className="text-gray-400 mb-2 flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
        {title}
      </h3>
      {services && (
        <div className="space-y-2 max-w-full">
          {services.map((service, index) => (
            <div key={index}>
              {showUrl ? (
                <InfoCode text={service.url ?? ''} />
              ) : (
                <InfoText bold>{getProviderServiceName(service.provider)}</InfoText>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NetworkModal({ network, subgraphCounts, onClose }: NetworkModalProps) {
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

  console.log('subgraphCounts', JSON.stringify(subgraphCounts));
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
          <div>
            <InfoLabel>ID</InfoLabel>
            <InfoText bold>{network.id}</InfoText>
          </div>
          <div>
            <InfoLabel>CAIP-2 ID</InfoLabel>
            <InfoText bold>{network.caip2Id}</InfoText>
          </div>
          {network.explorerUrls && (
            <div>
              <InfoLabel>Block Explorers</InfoLabel>
              <div className="space-y-2">
                {network.explorerUrls.map((url, index) => (
                  <InfoLink key={index} href={url}>
                    {url}
                  </InfoLink>
                ))}
              </div>
            </div>
          )}
          {network.docsUrl && (
            <div>
              <InfoLabel>Documentation</InfoLabel>
              <InfoLink href={network.docsUrl}>{network.docsUrl}</InfoLink>
            </div>
          )}

          <div className="col-span-full">
            {network.rpcUrls && (
              <div>
                <InfoLabel>RPC</InfoLabel>
                <div className="space-y-2 max-w-full">
                  {network.rpcUrls.map((url, index) => (
                    <div key={index} className="flex items-start max-w-full">
                      <InfoCode text={url} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {network.services && (
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceSection
                  title="Subgraphs"
                  color={getColors().subgraphs}
                  services={network.services.subgraphs}
                />
                <ServiceSection
                  title="Substreams-powered Subgraphs"
                  color={getColors().sps}
                  services={network.services.sps}
                />
                <ServiceSection
                  title="Firehose"
                  color={getColors().firehose}
                  services={network.services.firehose}
                  showUrl
                />
                <ServiceSection
                  title="Substreams"
                  color={getColors().substreams}
                  services={network.services.substreams}
                  showUrl
                />
              </div>
            </div>
          )}


            <div className="col-span-full">
              {subgraphCounts ? (
                <p className="text-white">
                  <span className="font-bold">{subgraphCounts.subgraphsCount}</span> subgraphs
                  {subgraphCounts.spsCount > 0 && (
                    <>, <span className="font-bold">{subgraphCounts.spsCount}</span> of them substreams-powered</>
                  )}
                  {' '}on{' '}
                  <InfoLink href={`https://thegraph.com/explorer?indexedNetwork=${network.id}`}>
                    The Graph Network
                  </InfoLink>
                </p>
              ) : (
                <InfoLink href={`https://thegraph.com/explorer?indexedNetwork=${network.id}`}>
                  Explore subgraphs on The Graph Network
                </InfoLink>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
