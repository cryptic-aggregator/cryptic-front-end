describe('Home Page Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });
  
    it('Перевіряє, що сторінка завантажується', () => {

    cy.contains(/Simple and Secure Management of Your Crypto Wallets|Просте та безпечне управління вашими крипто-гаманцями/i);
    cy.contains(/Track balances, analyze portfolios, and receive notifications with one click.|Відстежуйте баланси, аналізуйте портфелі та отримуйте сповіщення одним кліком./i);
    });
  
    it('Перевіряє, що кнопка "Start Now" працює', () => {
      cy.get('a').contains('Start Now').click();
      cy.url().should('include', '/signUp');
    });
  
    it('Перевіряє, що кнопка "Try Now" працює', () => {
      cy.get('a').contains('Try Now').click();
      cy.url().should('include', '/signUp');
    });
  
    it('Перевіряє підключення гаманця Metamask', () => {
        cy.get('a').contains('Try Now').click();
        cy.url().should('include', '/signUp');
    });
  
    it('Перевіряє, що секції Goals відображаються', () => {
        cy.get('a').contains('Try Now').click();
        cy.url().should('include', '/signUp');
    });
  
    it('Перевіряє, що футер присутній', () => {
      cy.get('footer').should('exist');
    });
  });
  