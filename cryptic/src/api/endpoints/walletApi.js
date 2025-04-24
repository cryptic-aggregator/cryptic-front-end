import httpClient from "../httpClient";

export const walletApi = {
  getWallets: async (portfolioId) => {
    return await httpClient.get(`/portfolio/${portfolioId}/wallets`);
  },
  changeVisibilityWallet: async (portfolioId, walletId, visibility) => {
    return await httpClient.patch(`/portfolio/${portfolioId}/wallet/${walletId}`, visibility);
  },
};