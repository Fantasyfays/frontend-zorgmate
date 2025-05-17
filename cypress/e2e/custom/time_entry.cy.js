describe('Uren registreren', () => {
    it('registreert een nieuwe tijdregistratie', () => {
        cy.visit('http://localhost:3000/time-entry');

        cy.get('select[name="clientId"]').select(1);
        cy.get('input[name="description"]').type('Test taak');
        cy.get('input[name="date"]').type('2025-05-07');
        cy.get('input[name="hours"]').clear().type('2');
        cy.get('input[name="hourlyRate"]').clear().type('75');

        cy.get('button[type="submit"]').click();
        cy.contains('Uur succesvol geregistreerd').should('exist');
    });
});
