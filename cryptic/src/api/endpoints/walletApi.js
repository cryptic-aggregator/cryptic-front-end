import httpClient from "../httpClient";

export const walletApi = {
  getWallets: async (data) => {
    const { portfolioId, search, networks } = data;

    const params = {};
    if (search) params.Search = search;
    if (networks && networks.length > 0) params.Networks = networks;

    return await httpClient.get(`/portfolio/${portfolioId}/wallets`, { params });
  },
  changeVisibilityWallet: async (portfolioId, walletId, visibility) => {
    return await httpClient.patch(`/portfolio/${portfolioId}/wallet/${walletId}`, visibility);
  },
  deleteWallet: async (portfolioId, walletId) => {
    return await httpClient.delete(`/portfolio/${portfolioId}/wallet/${walletId}`);
  },
};