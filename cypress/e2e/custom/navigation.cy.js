describe('Navigatie en basispagina\'s', () => {

    it('laadt de homepagina', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Welkom bij ZorgMate!').should('exist');
    });

    it('navigeert naar Gebruikerslijst via navbar', () => {
        cy.visit('http://localhost:3000');

        cy.get('button.navbar-toggler')
            .then(($btn) => {
                if ($btn.is(':visible')) {
                    cy.wrap($btn).click();
                }
            });

        cy.contains('Gebruikers').click();
        cy.url().should('include', '/users');
        cy.contains('Gebruikerslijst').should('exist');
    });
});
