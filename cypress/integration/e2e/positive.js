/// <reference types="cypress" />

describe('E2E Flow - Employee Leave Management', function () {
  beforeEach(function () {
    cy.fixture('admin').as('admin');
    cy.fixture('employee').as('newEmployee');
  });
  it.skip('Add new employee', function () {
    cy.visit(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    cy.get('input[name="username"]').clear().type(this.admin.username);
    cy.get('input[name="password"]').clear().type(this.admin.password);
    cy.get('button[type="submit"]').click();

    cy.get('a[href="/web/index.php/pim/viewPimModule"]').click();
    cy.contains('button', 'Add').click();
    cy.get('input[name="firstName"]').type(this.newEmployee.firstName);
    cy.get('input[name="middleName"]').type(this.newEmployee.middleName);
    cy.get('input[name="lastName"]').type(this.newEmployee.lastName);
    cy.get('.oxd-input.oxd-input--active')
      .eq(3)
      .clear()
      .type(this.newEmployee.employeeID);
    cy.get('.oxd-switch-input').click();
    cy.get('input[autocomplete="off"]')
      .eq(0)
      .clear()
      .type(this.newEmployee.username);
    cy.get('input[autocomplete="off"]')
      .eq(1)
      .clear()
      .type(this.newEmployee.password);
    cy.get('input[autocomplete="off"]')
      .eq(2)
      .clear()
      .type(this.newEmployee.password);
    cy.contains('button', 'Save').click();

    cy.contains('Successfully Saved').should('exist');
    cy.screenshot('01_add_employee_success');
    cy.location('pathname', { timeout: 5000 }).should(
      'include',
      '/pim/viewPersonalDetails'
    );
  });

  it.skip('Give leave entitlement for new employee', function () {
    cy.visit(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    cy.get('input[name="username"]').clear().type(this.admin.username);
    cy.get('input[name="password"]').clear().type(this.admin.password);
    cy.get('button[type="submit"]').click();

    cy.get('a[href="/web/index.php/leave/viewLeaveModule"]').click();
    cy.contains('Entitlements').click();
    cy.contains('Add Entitlements').click();

    cy.get('.oxd-text.oxd-text--p')
      .should('contain.text', 'Add Leave Entitlement')
      .and('be.visible');

    cy.contains('label', 'Individual Employee').click();
    cy.get('input[placeholder="Type for hints..."]').type(
      `${this.newEmployee.firstName} ${this.newEmployee.middleName} ${this.newEmployee.lastName}`
    );
    cy.get('.oxd-autocomplete-dropdown')
      .should('be.visible')
      .contains(
        `${this.newEmployee.firstName} ${this.newEmployee.middleName} ${this.newEmployee.lastName}`
      )
      .click();
    cy.get('.oxd-select-text-input').eq(0).click();
    cy.get('.oxd-select-dropdown')
      .should('be.visible')
      .contains(this.newEmployee.leaveType)
      .click();
    cy.get('.oxd-input').eq(1).clear().type(this.newEmployee.entitlement);
    cy.contains('button', 'Save').click();
    cy.contains('button', 'Confirm').click();

    cy.contains('Successfully Saved').should('exist');
    cy.screenshot('02_add_entitlement_success');
  });

  it.skip('Employee applies for leave', function () {
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

    cy.get('.oxd-date-input').eq(0).type(this.newEmployee.fromDate);
    cy.get('.oxd-date-input').eq(1).clear().type(this.newEmployee.toDate);

    cy.get('textarea').type('Requesting leave');
    cy.get('button[type=submit]').click();

    cy.contains('Successfully Saved').should('exist');
    cy.screenshot('03_apply_leave_success');
  });

  it.skip('Admin approve leave', function () {
    cy.visit(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    cy.get('input[name="username"]').clear().type(this.admin.username);
    cy.get('input[name="password"]').clear().type(this.admin.password);
    cy.get('button[type="submit"]').click();

    cy.get('a[href="/web/index.php/leave/viewLeaveModule"]').click();
    cy.contains('Leave List').click();

    cy.get('input[placeholder="Type for hints..."]').type(
      `${this.newEmployee.firstName} ${this.newEmployee.middleName} ${this.newEmployee.lastName}`
    );
    cy.get('.oxd-autocomplete-dropdown')
      .should('be.visible')
      .contains(
        `${this.newEmployee.firstName} ${this.newEmployee.middleName} ${this.newEmployee.lastName}`
      )
      .click();

    cy.get('button[type=submit]').contains('Search').click();

    cy.wait(2000);
    cy.get('.oxd-table-card').first().click();
    cy.get('button').contains('Approve').click();

    cy.contains('Successfully Updated').should('exist');
    cy.screenshot('04_approve_leave_success');
  });

  it('Employee check approved leave', function () {
    cy.visit(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    cy.get('input[name=username]').type(this.newEmployee.username);
    cy.get('input[name=password]').type(this.newEmployee.password);
    cy.get('button[type=submit]').click();

    cy.get('a[href="/web/index.php/leave/viewLeaveModule"]').click();
    cy.contains('My Leave').click();

    // cy.get('.oxd-date-input').eq(0).type(this.newEmployee.fromDate);
    // cy.get('.oxd-date-input').eq(1).clear().type(this.newEmployee.fromDate);
    // cy.get('button[type=submit]').click();

    cy.contains('Approved').should('exist');
    cy.screenshot('05_check_leave_status');
  });
});
