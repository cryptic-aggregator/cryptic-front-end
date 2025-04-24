describe('SideBarPortfolios', () => {
    beforeEach(() => {
        // Відвідуємо сторінку перед кожним тестом
        cy.visit('http://localhost:3000/dashboard');
    });

    it('Перенаправляє на сторінку входу, якщо користувач не авторизований', () => {
        cy.clearCookies(); // Видаляємо всі кукі для скидання авторизації
        cy.visit('http://localhost:3000/dashboard');
        cy.url().should('include', 'http://localhost:3000/signin');
    });

    it('Відображає список портфелів, якщо вони існують', () => {
        cy.intercept('GET', 'http://20.215.241.137/api/portfolio/list', { fixture: 'portfolios.json' }).as('getPortfolios');
        cy.wait('@getPortfolios');
        cy.contains('Test Portfolio').should('be.visible');
        
    });

    it('Відображає повідомлення, якщо портфелів немає', () => {
        cy.intercept('GET', 'http://20.215.241.137/api/portfolios', {
            statusCode: 200,
            body: []
        }).as('getPortfoliosEmpty');

        cy.setCookie('authToken', 'valid-token');
        cy.visit('http://localhost:3000/dashboard');

        cy.wait('@getPortfoliosEmpty');
        cy.contains("You don't have a portfolio yet, but you can easily create one").should('be.visible');
    });

    it('Дозволяє створювати новий портфель', () => {
        cy.setCookie('authToken', 'valid-token');
        cy.visit('http://localhost:3000/dashboard');

        cy.contains('Create Portfolio').click();
        cy.get('input[name="portfolioName"]').type('New Portfolio');
        cy.contains('Save').click();

        cy.contains('New Portfolio').should('be.visible');
    });

    it('Дозволяє видаляти портфель', () => {
        cy.intercept('GET', 'http://20.215.241.137/api/portfolios', {
            statusCode: 200,
            body: [{ id: 1, name: 'Test Portfolio' }]
        }).as('getPortfolios');

        cy.setCookie('authToken', 'valid-token');
        cy.visit('http://localhost:3000/dashboard');
        cy.wait('@getPortfolios');

        cy.get(`[title="edit"]`).click();
        cy.contains('Confirm').click();
        cy.contains('Test Portfolio').should('not.exist');
    });

    // Додатковий тест для перевірки правильного перенаправлення при відсутності авторизації
    it('Перенаправляє на сторінку входу, якщо токен недійсний', () => {
        cy.setCookie('authToken', 'invalid-token');
        cy.visit('http://localhost:3000/dashboard');
        cy.url().should('include', 'http://localhost:3000/signin');
    });
});
