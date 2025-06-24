describe('📌 Invoices CRUD – Alternatieve flows (zonder foutcodes)', () => {
    beforeEach(() => {
        cy.window().then(win => win.localStorage.setItem('token', 'fake-jwt'));
    });

    it('Verlaat verwijderen bij annulering van confirm', () => {
        cy.intercept('GET', '**/api/invoices', {
            statusCode: 200,
            body: [{
                id: 5,
                invoiceNumber: 'INV-5',
                status: 'UNPAID',
                senderName: 'Jan',
                receiverName: 'Piet',
                issueDate: '2024-01-01',
                dueDate: '2024-02-01',
                totalAmount: 123.45
            }]
        }).as('getInvoices');

        const deleteSpy = cy.spy().as('deleteSpy');
        cy.intercept('DELETE', '**/api/invoices/5', (req) => {
            deleteSpy();
            req.reply(204);
        });

        cy.visit('/invoices');
        cy.wait('@getInvoices');

        cy.window().then(win => cy.stub(win, 'confirm').returns(false));
        cy.contains('Verwijderen').click();

        cy.get('@deleteSpy').should('not.have.been.called');
    });

    it('Status wordt niet gewijzigd als je op huidige status klikt', () => {
        cy.intercept('GET', '**/api/invoices/2', {
            statusCode: 200,
            body: {
                id: 2,
                invoiceNumber: 'INV-2',
                status: 'PAID',
                senderName: 'A',
                receiverName: 'B',
                issueDate: '2024-01-01',
                dueDate: '2024-02-01',
                items: []
            }
        }).as('getInvoice');

        const patchSpy = cy.spy().as('patchSpy');
        cy.intercept('PATCH', '**/api/invoices/2/status/PAID', (req) => {
            patchSpy();
            req.reply(204);
        });

        cy.visit('/invoice/edit/2');
        cy.wait('@getInvoice');

        cy.get('[data-testid="status-paid"]').click();

        cy.get('@patchSpy').should('not.have.been.called');
    });
});
