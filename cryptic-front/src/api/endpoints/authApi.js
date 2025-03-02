import httpClient from '../httpClient';

export const authApi = {

  register: async (userData) => {
    const response = await httpClient.post('/users/register', {
      name: userData.name,
      password: userData.password,
      email: userData.email
    });
  
    return response;
  },
  
  login: async (credentials) => {
    const response = await httpClient.post('/users/login', {
      password: credentials.password,
      email: credentials.email
    });
  
    if (response.data.accessToken) {
      sessionStorage.setItem('accessToken', response.data.accessToken);
    }
  
    return response;
  }

};