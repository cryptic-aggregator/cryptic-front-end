import httpClient from "../httpClient";

export const transactionApi = {
  getTransactions: async (id, data) => {
    return await httpClient.get(`/portfolio/${id}/transactions`, {
      params: {
        Page: data.Page,
        PerPage: data.PerPage,
        TransactionType: data.TransactionType,
        DateFrom: data.DateFrom,
        DateTo: data.DateTo,
      },
    });
  },
};
