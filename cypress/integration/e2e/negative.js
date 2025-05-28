/// <reference types="cypress" />
describe('Negative Case', function () {
  beforeEach(function () {
    cy.fixture('admin').as('admin');
    cy.fixture('employee').as('newEmployee');
  });
  it('Negative Case - Employee applies leave without dates', function () {
    cy.visit(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    cy.get('input[name=username]').type(this.newEmployee.username);
    cy.get('input[name=password]').type(this.newEmployee.password);
    cy.get('button[type=submit]').click();

    cy.get('a[href="/web/index.php/leave/viewLeaveModule"]').click();
    cy.contains('Apply').click();

    cy.get('.oxd-select-text-input').click();
    cy.contains(this.newEmployee.leaveType).click();

    cy.get('textarea').type('Forgot to fill date');
    cy.get('button[type=submit]').click();

    cy.get('.oxd-input-group__message', { timeout: 5000 }).should('exist');
    cy.screenshot('07_apply_leave_no_date');
  });
});
