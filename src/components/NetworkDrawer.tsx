import { getNetworkNameAndVariant } from '@/lib/utils';
import type { Network } from '@pinax/graph-networks-registry';
import { NetworkIcon } from '@web3icons/react';
import { useEffect, useState } from 'react';

interface NetworkDrawerProps {
  network: Network;
  subgraphCounts?: { nativeCount: number; spsCount: number };
  onClose: () => void;
  isOpen: boolean;
}

function InfoLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-gray-400 mb-1">{children}</h3>;
}

function InfoText({ children, bold = false }: { children: React.ReactNode; bold?: boolean }) {
  return <p className={`text-white break-words ${bold ? 'font-bold' : ''}`}>{children}</p>;
}

function InfoLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 text-sm sm:text-base"
    >
      <span className="truncate">{children}</span>
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-label="Edit on GitHub"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}
function InfoCode({ text }: { text: string }) {
  return (
    <p className="text-white break-all font-mono text-xs sm:text-sm inline-flex items-center max-w-full">
      <span className="truncate">{text}</span>
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
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      type="button"
    >
      {copied ? (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Copied"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Copy to clipboard"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );
}

type ServiceType = 'subgraphs' | 'sps' | 'firehose' | 'substreams';

const getSubgraphStudioName = (url: string) => {
  if (url.includes('api.studio.thegraph.com')) {
    return 'Subgraph Studio';
  }
  return 'N/A';
};

function getServiceConfig(type: ServiceType) {
  switch (type) {
    case 'subgraphs':
      return {
        title: 'Subgraphs',
        color: '#66D8FF',
        showUrl: false,
      };
    case 'sps':
      return {
        title: 'Substreams-powered Subgraphs',
        color: '#4BCA81',
        showUrl: false,
      };
    case 'firehose':
      return {
        title: 'Firehose',
        color: '#FFA801',
        showUrl: true,
      };
    case 'substreams':
      return {
        title: 'Substreams',
        color: '#FF79C6',
        showUrl: true,
      };
    default:
      return {
        title: type,
        color: '#4C66FF',
        showUrl: false,
      };
  }
}

function getRelationText(kind: string): string {
  switch (kind) {
    case 'testnetOf':
      return 'Testnet of';
    case 'beaconOf':
      return 'Beacon chain of';
    case 'forkedFrom':
      return 'Forked from';
    case 'l2Of':
      return 'Rolls up to';
    case 'shardOf':
      return 'Shard of';
    case 'evmOf':
      return 'EVM chain of';
    default:
      return 'Related to';
  }
}

function getIndexerDocText(url: string, description?: string): string {
  if (description) {
    return description;
  }
  if (url.includes('infradao.com')) {
    return 'InfraDAO Docs';
  }
  return 'Indexer Docs';
}

interface ServiceSectionProps {
  type: ServiceType;
  services?: string[];
}

function ServiceSection({ type, services = [] }: ServiceSectionProps) {
  const { title, color, showUrl } = getServiceConfig(type);

  return (
    <div>
      <h3 className="text-gray-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
        <span
          className="w-3 h-3 rounded-full inline-block shrink-0"
          style={{ backgroundColor: services?.length ? color : '#494755' }}
        />
        {title}
      </h3>
      {services && (
        <div className="space-y-2 max-w-full">
          {services.map((url) => (
            <div key={url} className="min-w-0">
              {showUrl ? (
                <InfoCode text={url ?? 'N/A'} />
              ) : (
                <InfoText bold>{getSubgraphStudioName(url)}</InfoText>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NetworkDrawer({ network, subgraphCounts, onClose, isOpen }: NetworkDrawerProps) {
  const [showJson, setShowJson] = useState(false);

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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        onKeyDown={(e) => {
          if (['Enter', 'Space'].includes(e.key)) {
            onClose();
          }
        }}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[580px] bg-slate-800/90 backdrop-blur-xs shadow-xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-label="Close"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <NetworkIcon
                size={48}
                className="object-contain"
                {...getNetworkNameAndVariant(network)}
              />
              <div>
                <h2 className="text-xl sm:text-2xl text-white inline-block">
                  <span className="font-extrabold">{network.shortName}</span>{' '}
                  <span className="font-extralight">{network.secondName ?? ''}</span>
                </h2>
                <p className="text-gray-400">{network.fullName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <InfoLabel>ID</InfoLabel>
                <InfoText bold>{network.id}</InfoText>
              </div>
              <div>
                <InfoLabel>CAIP-2 ID</InfoLabel>
                <InfoText bold>{network.caip2Id}</InfoText>
              </div>

              {network.relations && (
                <div>
                  <InfoLabel>Relations</InfoLabel>
                  <div className="space-y-2">
                    {network.relations.map(({ kind, network }) => (
                      <InfoText key={`${kind}-${network}`}>
                        {getRelationText(kind)} <span className="font-bold">{network}</span>
                      </InfoText>
                    ))}
                  </div>
                </div>
              )}

              {network.explorerUrls && (
                <div>
                  <InfoLabel>Block Explorers</InfoLabel>
                  <div className="space-y-2">
                    {network.explorerUrls.map((url) => (
                      <div key={url} className="block">
                        <InfoLink href={url}>{url}</InfoLink>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {network.docsUrl && (
                <div>
                  <InfoLabel>Developer Docs</InfoLabel>
                  <InfoLink href={network.docsUrl}>{network.docsUrl}</InfoLink>
                </div>
              )}

              <div className="col-span-full">
                {network.rpcUrls && (
                  <div>
                    <InfoLabel>RPC</InfoLabel>
                    <div className="space-y-2 max-w-full">
                      {network.rpcUrls.map((url) => (
                        <div key={url} className="flex items-start max-w-full">
                          <InfoCode text={url} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {network.indexerDocsUrls && (
                <div className="col-span-full">
                  <InfoLabel>Indexer Docs</InfoLabel>
                  <div className="space-y-2">
                    {network.indexerDocsUrls.map((doc) => (
                      <div key={doc.url} className="flex items-center gap-2">
                        <InfoLink href={doc.url}>
                          {getIndexerDocText(doc.url, doc.description)}
                        </InfoLink>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="col-span-full">
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(network.services || {}).map(([type, services]) => (
                    <ServiceSection key={type} type={type as ServiceType} services={services} />
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <InfoLabel>The Graph Network</InfoLabel>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {network.issuanceRewards ? (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="img"
                        aria-label="Indexing Rewards"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="img"
                        aria-label="Indexing Rewards"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span className="text-white ml-2">Indexing Rewards</span>
                  </div>
                  {subgraphCounts && (
                    <>
                      {subgraphCounts.nativeCount > 0 && (
                        <InfoText>
                          <span className="font-bold">{subgraphCounts.nativeCount}</span> Native
                          Subgraphs
                        </InfoText>
                      )}
                      {subgraphCounts.spsCount > 0 && (
                        <InfoText>
                          <span className="font-bold">{subgraphCounts.spsCount}</span>{' '}
                          Substreams-powered Subgraphs
                        </InfoText>
                      )}
                      <InfoLink href={`https://thegraph.com/explorer?indexedNetwork=${network.id}`}>
                        View in Explorer
                      </InfoLink>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  type="button"
                >
                  {showJson ? 'Hide JSON' : 'View JSON'}
                </button>

                <InfoLink href="https://github.com/graphprotocol/networks-registry">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Edit on GitHub"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Edit on GitHub
                  </div>
                </InfoLink>
              </div>

              {showJson && (
                <div className="mt-4 bg-slate-900 p-4 rounded-lg overflow-auto relative">
                  <div className="absolute top-3 right-3">
                    <CopyButton text={JSON.stringify(network, null, 2)} />
                  </div>
                  <pre className="text-white text-sm">{JSON.stringify(network, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
