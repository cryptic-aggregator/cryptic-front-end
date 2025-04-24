Cypress.on('uncaught:exception', (err, runnable) => {
    // Ігноруємо помилки оновлення токена
    if (err.message.includes("401") || err.message.includes("refreshToken")) {
      return false;
    }
    return true;
  });
  