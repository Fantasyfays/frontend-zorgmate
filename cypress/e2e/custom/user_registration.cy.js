describe('Gebruiker registreren', () => {    it('registreert een nieuwe gebruiker', () => {
    cy.visit('http://localhost:3000/register');

    const username = 'testuser' + Date.now();
    const password = 'test1234';

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('select[name="role"]').select('USER');
    cy.get('button[type="submit"]').click();

    cy.contains('geregistreerd').should('exist');
});
});
