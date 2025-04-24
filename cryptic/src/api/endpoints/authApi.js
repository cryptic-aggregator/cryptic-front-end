import httpClient from "../httpClient";

export const authApi = {
  register: async (userData) => {
    const response = await httpClient.post("/users/register", userData);
    return response;
  },

  login: async (credentials) => {
    const response = await httpClient.post("/users/login", credentials);
    return response.data; 
  },
};
