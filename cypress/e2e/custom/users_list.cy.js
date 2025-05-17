describe('Gebruikerslijst', () => {
    it('toont een lijst van gebruikers', () => {
        cy.visit('http://localhost:3000/users');
        cy.get('.card').should('have.length.at.least', 1);
    });
});
