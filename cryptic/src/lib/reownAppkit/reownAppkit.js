import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { mainnet, solana, bitcoin } from '@reown/appkit/networks';
import store from '../../store/index.js';
import { setWalletAddress, clearWalletAddress } from '../../store/slices/walletSlice.js';

const projectId = import.meta.env.VITE_PROJECT_ID || '292ef0994972ab36ceb67522a5f9a3b4';

const metadata = {
  name: 'Cryptic',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const networks = [mainnet, solana, bitcoin];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const bitcoinAdapter = new BitcoinAdapter({ projectId });

const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: false,
    socials: false,
    emailShowWallets: false,
    legalCheckbox: true,
  },
  allWallets: 'SHOW',
});

// контрольна змінна, щоб уникнути багаторазових підписок
const isSubscribed  = false;

export function getCurrentAddressAppKit() {
  return modal.getAddress();
}

export function openAppKit() {
  console.log("🔓 Opening AppKit modal...");
  modal.open();

  if (!isSubscribed) {
    const updateWalletState = () => {
      const address = modal.getAddress();
      if (address) {
        console.log("✅ Wallet connected:", address);
        store.dispatch(setWalletAddress(address));
        modal.close(); // Автоматично закриваємо після вибору
      } else {
        console.log("❌ Wallet disconnected");
        store.dispatch(clearWalletAddress());
      }
    };

    modal.subscribeNetwork(updateWalletState);
    isSubscribed = true;
  }
}

export function closeAppKit() {
  console.log("🔒 Closing AppKit modal...");
  store.dispatch(clearWalletAddress());
  modal.close();
}

export const wagmiConfig = wagmiAdapter.wagmiConfig;
