describe("SignUp Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/signUp");
  });

  it("Рендерить форму реєстрації", () => {
    cy.contains(/sign up/i).should("be.visible");
  });

  it("Показує помилки при незаповнених полях", () => {
    cy.get("button").contains("Sign Up").click();
    cy.contains("This is required.").should("be.visible");
  });

  it("Відображає помилку, якщо паролі не співпадають", () => {
    cy.get("input[placeholder='Enter your password']").type("password123");
    cy.get("input[placeholder='Repeat your password']").type("wrongpassword");
    cy.get("button").contains("Sign Up").click();
    cy.contains("Passwords do not match.").should("be.visible");
  });

  it("Успішна реєстрація", () => {
    cy.intercept("POST", "http://20.215.241.137/api/users/register", { statusCode: 201 }).as("register");

    cy.get("input[placeholder='Enter your login']").type("TestUser");
    cy.get("input[placeholder='Enter your email']").type("test@example.com");
    cy.get("input[placeholder='Enter your password']").type("password123");
    cy.get("input[placeholder='Repeat your password']").type("password123");
    cy.get("input#check").click();
    cy.get("button").contains("Sign Up").click();

    cy.wait("@register").its("response.statusCode").should("eq", 201);
    cy.url().should("include", "/signIn");
  });
});
