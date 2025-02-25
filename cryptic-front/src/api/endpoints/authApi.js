import httpClient from '../httpClient';

export const authApi = {
  register: (userData) => {
    return httpClient.post('/users/register', {
      name: userData.name,
      password: userData.password,
      email: userData.email
    });
  },
  
  // Можна додати інші методи для авторизації
  login: (credentials) => {
    return httpClient.post('/users/login', {
      email: credentials.email,
      password: credentials.password
    });
  }
};