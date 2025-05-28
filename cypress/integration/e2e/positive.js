/// <reference types="cypress" />

function changeDateFormat(tanggal) {
  const [yyyy, mm, dd] = tanggal.split('-'); // Pakai '-' sebagai pemisah
  return `${yyyy}-${dd}-${mm}`; // Format yang diinginkan
}

describe('E2E Flow - Employee Leave Management', function () {
  beforeEach(function () {
    cy.fixture('admin').as('admin');
    cy.fixture('employee').as('newEmployee');
  });
  it('Add new employee', function () {
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

    cy.contains('Successfully Saved', { timeout: 5000 }).should('exist');
    cy.screenshot('01_add_employee_success');
    cy.location('pathname', { timeout: 5000 }).should(
      'include',
      '/pim/viewPersonalDetails'
    );
  });

  it('Give leave entitlement for new employee', function () {
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
    cy.screenshot('02_add_entitlement_success', { timeout: 5000 });
  });

  it('Employee applies for leave', function () {
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

    cy.contains('Successfully Saved', { timeout: 5000 }).should('exist');
    cy.screenshot('03_apply_leave_success');
  });

  it('Admin approve leave', function () {
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
        `${this.newEmployee.firstName} ${this.newEmployee.middleName} ${this.newEmployee.lastName}`,
        { timeout: 5000 }
      )
      .click();

    cy.get('.oxd-multiselect-wrapper')
      .contains('Pending Approval')
      .then(($el) => {
        if ($el.length) {
          cy.log('Pending Approval sudah dipilih');
        } else {
          cy.get('.oxd-multiselect-wrapper')
            .click()
            .then(() => {
              cy.contains('Pending Approval').click();
            });
        }
      });

    cy.get('.oxd-input-group.oxd-input-field-bottom-space')
      .eq(3) //leave type
      .within(() => {
        cy.get('.oxd-select-text-input')
          .click()
          .then(() => {
            cy.get('.oxd-select-dropdown').should('be.visible');
            cy.contains(this.newEmployee.leaveType).click();
          });
      });

    cy.get('button[type=submit]').contains('Search').click();

    const tanggalCuti =
      changeDateFormat(this.newEmployee.fromDate) +
      ' to ' +
      changeDateFormat(this.newEmployee.toDate);

    cy.wait(2000);
    cy.contains(tanggalCuti)
      .closest('.oxd-table-row') // Ganti tr menjadi class row yang kamu pakai
      .within(() => {
        cy.contains('Requesting leave').should('exist');
        cy.get('button').contains('Approve').click();
      });

    cy.contains('Successfully Updated', { timeout: 5000 }).should('exist');
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

    const tanggalCuti =
      changeDateFormat(this.newEmployee.fromDate) +
      ' to ' +
      changeDateFormat(this.newEmployee.toDate);

    cy.contains(tanggalCuti)
      .closest('.oxd-table-row') // Ganti tr menjadi class row yang kamu pakai
      .within(() => {
        cy.contains('Taken', { timeout: 5000 }).should('exist');
      });
    cy.screenshot('05_check_leave_status');
  });
});
