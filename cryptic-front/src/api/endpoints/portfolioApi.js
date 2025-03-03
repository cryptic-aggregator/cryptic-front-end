import httpClient from "../httpClient";
import store from "../../store/index.js";
import { setPortfolios } from "../../store/slices/portfolioSlice.js";

export const portfolioApi = {
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
