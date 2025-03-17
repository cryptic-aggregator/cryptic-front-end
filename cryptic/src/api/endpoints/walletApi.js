import httpClient from "../httpClient";

export const walletApi = {
  getPortfolios: async () => {
    return await httpClient.get("/portfolio/list");
  },
  addPortfolio: async (data) => {
    return await httpClient.post("/portfolio", data); 
  },
  deletePortfolio: async (data) => {
    return await httpClient.delete(`/portfolio/${data}`,); 
  },
  infoPortfolio: async (data) => {
    return await httpClient.get(`/portfolio/${data}/info`,); 
  },
};
