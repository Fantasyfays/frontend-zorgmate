describe('Automatische factuurgeneratie', () => {
    it('probeert een factuur te genereren voor een klant', () => {
        cy.intercept('GET', 'http://localhost:8080/api/clients').as('getClients');
        cy.visit('http://localhost:3000/invoice/auto');
        cy.wait('@getClients');

        cy.get('select[name="clientId"]').should('exist');

        cy.get('select[name="clientId"] option').eq(1).then($option => {
            const value = $option.val();
            cy.get('select[name="clientId"]').select(value);
        });

        cy.get('button[type="submit"]').click();

        cy.get('body').then(($body) => {
            if ($body.text().includes('Factuur gegenereerd')) {
                cy.contains('Factuur gegenereerd').should('exist');
            } else if ($body.text().includes('Fout bij genereren van factuur')) {
                cy.contains('Fout bij genereren van factuur').should('exist');
            } else {
                throw new Error('❌ Geen verwachte feedbackmelding gevonden na factuurpoging.');
            }
        });
    });
});
