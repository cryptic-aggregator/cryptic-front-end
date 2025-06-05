import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { mainnet, sepolia, solana, bitcoin } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

export const projectId = import.meta.env.VITE_PROJECT_ID || '292ef0994972ab36ceb67522a5f9a3b4';

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'Cryptic',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

export const networks = [mainnet, sepolia, solana,bitcoin];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage:cookieStorage
  }),
  ssr: true,
  networks,
  projectId,
});

export const solanaWeb3JsAdapter = new SolanaAdapter({ projectId })

export const bitcoinAdapter = new BitcoinAdapter({ projectId });

export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: false,
    analytics: false,
    socials: false,
    emailShowWallets: false,
    legalCheckbox: true,
  },
  allWallets: 'SHOW',
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
