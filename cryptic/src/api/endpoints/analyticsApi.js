import httpClient from "../httpClient";

export const analyticsApi = {
  getAnalyticsAllocations: async (data) => {
    return await httpClient.get(`/portfolio/${data}/analytic/allocations`,); 
  },

};
