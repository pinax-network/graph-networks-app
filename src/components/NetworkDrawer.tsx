import { getNetworkNameAndVariant } from '@/lib/utils';
import { Network } from '@/types/registry';
import { NetworkIcon } from '@web3icons/react';
import { useState, useEffect } from 'react';

interface NetworkDrawerProps {
  network: Network;
  subgraphCounts?: { subgraphsCount: number; spsCount: number };
  onClose: () => void;
  isOpen: boolean;
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
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export function NetworkDrawer({ network, subgraphCounts, onClose, isOpen }: NetworkDrawerProps) {
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
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-[550px] bg-slate-800 shadow-xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 relative">
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

            <div className="grid grid-cols-1 gap-6">
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
                      <div key={index} className="block">
                        <InfoLink key={index} href={url}>
                          {url}
                        </InfoLink>
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
                      {network.rpcUrls.map((url, index) => (
                        <div key={index} className="flex items-start max-w-full">
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
                    {network.indexerDocsUrls.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <InfoLink href={doc.url}>
                          {doc.kind === 'rpc' ? 'Archive Node Setup' :
                           doc.kind === 'firehose' ? 'Firehose Setup' :
                           'Other Setup'}
                        </InfoLink>
                        {doc.hint && (
                          <span className="text-sm text-gray-400">
                            ({doc.hint})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {network.services && (
                <div className="col-span-full">
                  <div className="grid grid-cols-1 gap-6">
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
                <InfoLabel>The Graph Network</InfoLabel>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {network.issuanceRewards ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-white ml-2">Indexing Rewards</span>
                  </div>
                  { subgraphCounts && (
                    <>
                      <InfoText>
                        <span className="font-bold">{subgraphCounts.subgraphsCount}</span> subgraphs
                      </InfoText>
                      {subgraphCounts.spsCount > 0 && (
                        <InfoText>
                          <span className="font-bold">{subgraphCounts.spsCount}</span> substreams-powered subgraphs
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
            <div className="mt-8 pt-4 border-t border-gray-700 flex justify-end">
              <InfoLink href="https://github.com/graphprotocol/networks-registry">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                  Edit on GitHub
                </div>
              </InfoLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
