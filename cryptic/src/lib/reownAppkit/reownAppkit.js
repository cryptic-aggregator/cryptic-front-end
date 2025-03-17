import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { mainnet, solana, bitcoin } from '@reown/appkit/networks';
import { useState } from "react";
import store from "../../store/index.js";
import { setWalletAddress, clearWalletAddress } from "../../store/slices/walletSlice.js";
import { watchAccount, getAccount } from "@wagmi/core";

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

const bitcoinAdapter = new BitcoinAdapter({
  projectId,
});

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
export function getCurrentAddressAppKit() {
  console.log("Get Current address",modal.getAddress() );
  return modal.getAddress()
}
export function openAppKit() {
  console.log("Open AppKit modal");
  modal.open();

  const updateWalletState = () => {
    const address = modal.getAddress();
    if (address) {
      console.log("Connected wallet address:", address);
      store.dispatch(setWalletAddress(address));
      modal.close();
    } else {
      console.log("Disconnected wallet address:", address);
      store.dispatch(clearWalletAddress());
    }
  };

  // Підписуємось на зміни мережі та адреси
  modal.subscribeNetwork(updateWalletState);
  modal.subscribeShouldUpdateToAddress(updateWalletState);

}



export function closeAppKit() {
  console.log("Close AppKit modal");
  modal.close();
}

export const wagmiConfig = wagmiAdapter.wagmiConfig;

