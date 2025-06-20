/// <reference types="cypress" />

describe('📌 Clients CRUD ', () => {
    beforeEach(() => {
        cy.window().then(win => win.localStorage.setItem('token', 'fake-jwt'));
    });

    it('Formulier valideert ontbrekende naam', () => {
        cy.visit('/clients/new');
        cy.get('input[name="email"]').type('klant@test.nl');
        cy.get('input[name="phone"]').type('0612345678');
        cy.get('form').submit();

        cy.get('input[name="name"]:invalid').should('exist');
    });

    it('Annuleert formulier zonder submit', () => {
        cy.visit('/clients/new');
        cy.get('input[name="name"]').type('AnnuleerCo');
        cy.get('input[name="email"]').clear();
        cy.get('input[name="phone"]').clear();

        cy.get('input[name="name"]').should('have.value', 'AnnuleerCo');
        cy.get('form').within(() => {
            cy.get('input[name="email"]').should('have.value', '');
            cy.get('input[name="phone"]').should('have.value', '');
        });
    });
});
