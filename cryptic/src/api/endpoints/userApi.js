import httpClient from "../httpClient";

export const userApi = {
  getProfile: async () => {
    return await httpClient.get(`/users/profile`); 
  },
  updateProfile: async (data) => {
    return await httpClient.put("/users/profile", data);
  },
  sendRecoveryCode: async (data) => {
    return await httpClient.post("/users/forgot-password-code", data); 
  },
  resetPassword: async (data) => {
    return await httpClient.post(`/users/reset-password-code`, data); 
  },
  setupTwoFactor: async () => {
    return await httpClient.get(`/users/2fa/setup`,); 
  },
  sendCodeTwoFactor: async (data) => {
    return await httpClient.post(`/users/2fa/confirm`, data); 
  },
  disableTwoFactor: async () => {
    return await httpClient.post(`/users/2fa/disable`); 
  },
};
