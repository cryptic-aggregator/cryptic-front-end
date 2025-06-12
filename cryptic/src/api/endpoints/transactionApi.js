import httpClient from "../httpClient";

export const transactionApi = {
  getTransactions: async (id, data) => {
      const { page, perPage, transactionType, dateFrom, dateTo, search } = data;
    
        const params = {};
        if (page) params.Page = page;
        if (perPage) params.PerPage = perPage;
        if (transactionType) params.TransactionType = transactionType;
        if (dateFrom) params.DateFrom = dateFrom;
        if (dateTo) params.DateTo = dateTo;
        if (search) params.Search = search;
        return await httpClient.get(`/portfolio/${id}/transactions`, { params });

  },
};
