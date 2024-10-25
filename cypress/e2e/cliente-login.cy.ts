describe("Prueba E2E para el flujo de login", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      if (err.message.includes("Cannot read properties of null")) {
        return false;
      }
      return true;
    });
  
    it("Iniciear sesión con credenciales válidas", () => {
      cy.visit("/login-clientes");
  
      cy.get('input[id="correo"]').type("20200776@uthh.edu.mx");
      cy.get('input[id="password"]').type("AAaa&&66");
        
      cy.get('button[type="submit"]').click({ force: true });
  
      cy.url({ timeout: 50000 }).should("include", "/inicio-cliente");
  
    });

  
    
  });