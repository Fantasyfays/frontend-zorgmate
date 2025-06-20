/// <reference types="cypress" />

describe('📌 Users CRUD – Alternatieve flows (zonder foutcodes)', () => {
    beforeEach(() => {
        cy.window().then(win => win.localStorage.setItem('token', 'fake-jwt'));
    });

    it('Formulier wordt niet verzonden zonder gebruikersnaam', () => {
        cy.visit('/register');
        cy.get('input[name="password"]').type('geheim');
        cy.get('select').select('USER');
        cy.get('form').submit();

        cy.get('input[name="username"]:invalid').should('exist');
    });

    it('De juiste rol is vooraf geselecteerd bij bewerken', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: { id: 1, username: 'demo', role: 'ADMIN' }
        }).as('getUser');

        cy.visit('/users/edit/1');
        cy.wait('@getUser');

        cy.get('select').should('have.value', 'ADMIN');
    });

    it('Annuleert bewerken van gebruiker en keert terug naar overzicht', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: { id: 1, username: 'jan', role: 'USER' }
        }).as('getUser');

        cy.visit('/users/edit/1');
        cy.wait('@getUser');

        // Simuleer een wijziging
        cy.get('select').select('ADMIN');

        // Klik op annuleren
        cy.contains('Annuleren').click();

        // We moeten terug op de overzichtspagina zijn
        cy.url().should('include', '/users');
    });
});
