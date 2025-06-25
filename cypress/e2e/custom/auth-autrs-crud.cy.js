describe('Volledige facturatieflow – auto factuur genereren na registratie en uren', () => {
    const username = 'test';
    const password = '123!';
    const klantnaam = 'klant';
    const email = 'klant@test.nl';
    const clientLabel = `${klantnaam} (${email})`;

    before(() => {
        cy.visit('/register');
        cy.get('[data-testid="username"]').type(username);
        cy.get('[data-testid="password"]').type(password);
        cy.get('[data-testid="role"]').select('USER');
        cy.get('[data-testid="register-form"]').submit();
        cy.contains(`Gebruiker ${username} geregistreerd!`).should('exist');
    });

    beforeEach(() => {
        cy.visit('/login');
        cy.get('[data-testid="login-username"]').type(username);
        cy.get('[data-testid="login-password"]').type(password);
        cy.get('[data-testid="login-form"]').submit();
        cy.url().should('include', '/invoices');
    });

    it('Happy flow: registreert uren en genereert automatisch een factuur', () => {
        cy.visit('/clients/new');
        cy.get('[data-testid="client-name"]').type(klantnaam);
        cy.get('[data-testid="client-email"]').type(email);
        cy.get('[data-testid="client-phone"]').type('0612345678');
        cy.get('[data-testid="client-postcode"]').type('6545CA');
        cy.get('[data-testid="client-houseNumber"]').type('29');
        cy.get('[data-testid="client-street"]').should('not.have.value', '');
        cy.get('[data-testid="client-city"]').should('not.have.value', '');
        cy.get('[data-testid="client-form"]').submit();
        cy.contains('Klant succesvol aangemaakt!').should('exist');

        cy.visit('/time-entry');
        cy.get('[data-testid="entry-clientId"]').select(clientLabel);
        cy.get('[data-testid="entry-description"]').type('test werkzaamheden');
        cy.get('[data-testid="entry-date"]').type('2025-06-25');
        cy.get('[data-testid="entry-hours"]').clear();
        cy.get('[data-testid="entry-hours"]').type('3');
        cy.get('[data-testid="entry-hourlyRate"]').clear();
        cy.get('[data-testid="entry-hourlyRate"]').type('80');
        cy.get('[data-testid="entry-form"]').submit();
        cy.contains('Uur succesvol geregistreerd!').should('exist');

        cy.visit('/invoice/auto');
        cy.get('[data-testid="auto-client-select"]').select(clientLabel);
        cy.get('[data-testid="auto-form"]').submit();
        cy.get('[data-testid="auto-message"]').should('contain', 'Factuur gegenereerd');
    });

    it('Alt-flow: toont validatiefouten bij registratie zonder gegevens', () => {
        cy.visit('/register');
        cy.get('[data-testid="register-form"]').submit();
        cy.get('[data-testid="register-error"]')
            .should('exist')
            .and('contain', 'Gebruikersnaam is verplicht');
    });

    it('Alt-flow: voorkomt klantaanmaak zonder geldig e-mailadres', () => {
        cy.visit('/clients/new');
        cy.get('[data-testid="client-name"]').type('Testklant');
        cy.get('[data-testid="client-email"]').type('ongeldigemail');
        cy.get('[data-testid="client-phone"]').type('0612345678');
        cy.get('[data-testid="client-postcode"]').type('6545CA');
        cy.get('[data-testid="client-houseNumber"]').type('29');
        cy.get('[data-testid="client-form"]').submit();
        cy.contains('Voer een geldig e-mailadres in').should('exist');
    });

    it('Alt-flow: weigert tijdregistratie zonder datum', () => {
        cy.visit('/time-entry');
        cy.get('[data-testid="entry-description"]').type('Zonder datum');
        cy.get('[data-testid="entry-hours"]').clear();
        cy.get('[data-testid="entry-hours"]').type('2');
        cy.get('[data-testid="entry-hourlyRate"]').clear();
        cy.get('[data-testid="entry-hourlyRate"]').type('75');
        cy.get('[data-testid="entry-form"]').submit();
        cy.contains('Datum is verplicht').should('exist');
    });

});
