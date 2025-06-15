import httpClient from "../httpClient";

export const analyticsApi = {
  getAnalyticsAllocations: async (data) => {
    return await httpClient.get(`/portfolio/${data}/analytic/allocations`,); 
  },
  getRisksAndVolatility: async (id, data) => {
    const { symbol, fromTs, toTs, pointsCount } = data;
  
      const params = {};
      if (symbol) params.Symbol = symbol;
      if (fromTs) params.FromTs = fromTs;
      if (toTs) params.ToTs = toTs;
      if (pointsCount) params.PointsCount = pointsCount;

    return await httpClient.get(`/portfolio/${id}/correlation`, { params }); 
  },
  getTotalProfitLoss: async (id, data) => {
    const { fromTs, toTs, pointsCount } = data;
  
      const params = {};
      if (fromTs) params.FromTs = fromTs;
      if (toTs) params.ToTs = toTs;
      if (pointsCount) params.PointsCount = pointsCount;

    return await httpClient.get(`/portfolio/${id}/pnl`, { params }); 
  },
  getBalanceChange: async (id, data) => {
    const { fromTs, toTs, pointsCount } = data;
  
      const params = {};
      if (fromTs) params.FromTs = fromTs;
      if (toTs) params.ToTs = toTs;
      if (pointsCount) params.PointsCount = pointsCount;

    return await httpClient.get(`/portfolio/${id}/balance-graph`, { params }); 
  },
};
