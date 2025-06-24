describe('📌 Clients CRUD', () => {
    beforeEach(() => {
        cy.window().then(win => win.localStorage.setItem('token', 'fake-jwt'));
    });

    it('Toont validatie bij ontbreken van verplichte velden', () => {
        cy.visit('/clients/new');

        cy.get('input[name="email"]').type('klant@test.nl');
        cy.get('input[name="phone"]').type('0612345678');
        cy.get('input[name="postcode"]').type('6545CA');
        cy.get('input[name="houseNumber"]').type('29');

        cy.get('form').submit();

        cy.get('input[name="name"]:invalid').should('exist');
    });

    it('Verstuurt formulier succesvol bij geldige input', () => {
        cy.intercept('GET', '/api/address?postcode=6545CA&huisnummer=29', {
            statusCode: 200,
            body: {
                street: 'Waldeck Pyrmontsingel',
                city: 'Nijmegen'
            },
        }).as('lookupAddress');

        cy.intercept('POST', '/api/clients', {
            statusCode: 201,
            body: {},
        }).as('createClient');

        cy.visit('/clients/new');

        cy.get('input[name="name"]').type('Testbedrijf');
        cy.get('input[name="email"]').type('test@bedrijf.nl');
        cy.get('input[name="phone"]').type('0612345678');
        cy.get('input[name="postcode"]').type('6545CA');
        cy.get('input[name="houseNumber"]').type('29');

        cy.wait('@lookupAddress');
        cy.get('input[name="street"]').should('have.value', 'Waldeck Pyrmontsingel');
        cy.get('input[name="city"]').should('have.value', 'Nijmegen');

        cy.get('form').submit();

        cy.wait('@createClient');
        cy.contains('✅ Klant succesvol aangemaakt!').should('exist');
    });

    it('Toont foutmelding bij mislukte submit', () => {
        cy.intercept('GET', '/api/address?postcode=6545CA&huisnummer=29', {
            statusCode: 200,
            body: {
                street: 'Waldeck Pyrmontsingel',
                city: 'Nijmegen'
            },
        }).as('lookupFailAddress');

        cy.intercept('POST', '/api/clients', {
            statusCode: 500,
            body: {},
        }).as('createClientFail');

        cy.visit('/clients/new');

        cy.get('input[name="name"]').type('FailCo');
        cy.get('input[name="email"]').type('fail@bedrijf.nl');
        cy.get('input[name="phone"]').type('0612345678');
        cy.get('input[name="postcode"]').type('6545CA');
        cy.get('input[name="houseNumber"]').type('29');

        cy.wait('@lookupFailAddress');
        cy.get('input[name="street"]').should('have.value', 'Waldeck Pyrmontsingel');
        cy.get('input[name="city"]').should('have.value', 'Nijmegen');

        cy.get('form').submit();

        cy.wait('@createClientFail');
        cy.contains('❌ Fout bij aanmaken klant.').should('exist');
    });

    it('Toont foutmelding als adres niet gevonden wordt', () => {
        cy.intercept('GET', '/api/address?postcode=9999ZZ&huisnummer=99', {
            statusCode: 404,
            body: {}
        }).as('addressNotFound');

        cy.visit('/clients/new');

        cy.get('input[name="postcode"]').type('9999ZZ');
        cy.get('input[name="houseNumber"]').type('99');

        cy.wait('@addressNotFound');
        cy.get('input[name="street"]').should('have.value', '');
        cy.get('input[name="city"]').should('have.value', '');
        cy.contains('⚠️ Adres niet gevonden').should('exist');
    });

    it('Toont validatiefout bij ongeldig e-mailadres', () => {
        cy.intercept('GET', '/api/address?postcode=6545CA&huisnummer=29', {
            statusCode: 200,
            body: {
                street: 'Waldeck Pyrmontsingel',
                city: 'Nijmegen'
            },
        }).as('lookupAddress');

        cy.visit('/clients/new');

        cy.get('input[name="name"]').type('Testbedrijf');
        cy.get('input[name="email"]').type('geen-email');
        cy.get('input[name="phone"]').type('0612345678');
        cy.get('input[name="postcode"]').type('6545CA');
        cy.get('input[name="houseNumber"]').type('29');

        cy.wait('@lookupAddress');

        cy.get('form').submit();

        cy.get('input[name="email"]:invalid').should('exist');
    });

    it('Toont validatiefout bij ongeldig telefoonnummer', () => {
        cy.intercept('GET', '/api/address?postcode=6545CA&huisnummer=29', {
            statusCode: 200,
            body: {
                street: 'Waldeck Pyrmontsingel',
                city: 'Nijmegen'
            },
        }).as('lookupAddress');

        cy.visit('/clients/new');

        cy.get('input[name="name"]').type('Testbedrijf');
        cy.get('input[name="email"]').type('test@bedrijf.nl');
        cy.get('input[name="phone"]').type('123');
        cy.get('input[name="postcode"]').type('6545CA');
        cy.get('input[name="houseNumber"]').type('29');

        cy.wait('@lookupAddress');

        cy.get('form').submit();

        cy.get('input[name="phone"]:invalid').should('exist');
    });
});
