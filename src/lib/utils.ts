import { Network } from "@pinax/graph-networks-registry";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNetworkNameAndVariant(network: Network) {
  return network.icon?.web3Icons
    ? ({
        network: network.icon.web3Icons.name,
        variant:
          network.icon.web3Icons.variants?.length === 1 &&
          network.icon.web3Icons.variants[0] === "mono"
            ? "mono"
            : "branded",
      } as const)
    : ({
        network: "ethereum",
        variant: "mono",
      } as const);
}
