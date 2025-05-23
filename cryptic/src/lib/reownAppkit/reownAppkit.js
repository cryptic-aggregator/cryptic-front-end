import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { mainnet, solana, bitcoin } from '@reown/appkit/networks';
import store from '../../store/index.js';
import { setWalletConnectionReown, clearWalletConnectionReown } from '../../store/slices/walletSlice.js';
import { cookieStorage, useAccount, useConnect, useConnectorClient, createStorage } from 'wagmi';

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

export const networks = [mainnet,solana,bitcoin];

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

let isSubscribed = false;

function subscribeToWalletEvents() {
  if (isSubscribed) return;

  modal.subscribeNetwork(updateWalletState);
  isSubscribed = true;
}

let lastAddress = null;

const updateWalletState = () => {
  setTimeout(() => {
    const address =   modal.getAddress();
    if (address) {
      if (address === lastAddress) return;
      const caipAddress =  modal.getCaipAddress();

      const walletInfo = modal.getWalletInfo();

      const provider = modal.getWalletProvider();

      let providerName = 'unknown';

      if (provider) {
        if (typeof provider.name === 'string') providerName = provider.name;
        else if (provider.constructor?.name) providerName = provider.constructor.name;
        else if (typeof provider.walletName === 'string') providerName = provider.walletName;
      }

      lastAddress = address;

    console.log("provider:", providerName);
      store.dispatch(setWalletConnectionReown({
        address: address || null,
        caipAddress: caipAddress || null,
        walletInfoName: walletInfo?.name || null,
        walletInfoRdns: walletInfo?.rdns || null,
        providerName: providerName || null,
      }));

      modal.close();
    } else {
      console.log("❌ Wallet disconnected");
      store.dispatch(clearWalletConnectionReown());
    }
  }, 500);
};

/*
const updateWalletState = () => {
  setTimeout(() => {
    const address =   modal.getAddress();

    // 🚫 Якщо адреса не змінилась — не оновлюй
    if (address) {
      if (address === lastAddress) return;
          const provider = modal.getWalletProvider();
        const walletInfo = modal.getWalletInfo();

      lastAddress = address;

      console.log("💼 Wallet info:", walletInfo?.rdns);
      console.log("Wallet name:", walletInfo?.name);
      console.log("caipAddress:", modal.getCaipAddress());
      console.log("caipAddress:", modal.getCaipAddress());

      let providerName = 'unknown';

      if (provider) {
        if (typeof provider.name === 'string') providerName = provider.name;
        else if (provider.constructor?.name) providerName = provider.constructor.name;
        else if (typeof provider.walletName === 'string') providerName = provider.walletName;
      }

      console.log("Wallet connected via provider:", providerName);

      store.dispatch(setWalletAddress(address));
      modal.close();
    } else {
      console.log("❌ Wallet disconnected");
      store.dispatch(clearWalletAddress());
    }
  }, 200);
};
*/
export async function openAppKit(connector) {
  //const connector = wagmiConfig.connectors.find((c) => c.id === 'app.phantom');

  console.log("🔓 Opening AppKit modal...");
 // await connector.connect();
  //console.log('✅ Перепідключено до Trust Wallet');
  modal.open();

  subscribeToWalletEvents();
}
export function closeAppKit() {
  console.log('🔒 Closing AppKit modal...');
  store.dispatch(clearWalletConnectionReown());
  modal.close();
}

export const wagmiConfig = wagmiAdapter.wagmiConfig;
