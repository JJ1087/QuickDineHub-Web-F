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
  
      cy.url({ timeout: 90000 }).should("include", "/inicio-cliente");
  
    });

    it("Debe mostrar un mensaje de error con credenciales inválidas", () => {
      // Visita la página de inicio de sesión
      cy.visit("/login-clientes");
    
      // Ingresa un correo y una contraseña inválidos
      cy.get('input[id="correo"]').type("correo@incorrecto.com");
      cy.get('input[id="password"]').type("contraseñaIncorrecta");
    
      // Haz clic en el botón de envío
      cy.get('button[type="submit"]').click({ force: true });
    
      // Verifica que el mensaje de error aparezca y sea visible
      cy.contains("La contraseña o email son incorrectos", { timeout: 10000 }).should("be.visible");
    });
    
   
    
    
    
    
    
    
  });