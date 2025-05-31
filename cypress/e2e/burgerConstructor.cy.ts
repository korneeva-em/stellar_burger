/// <reference types="cypress" />

const hostUrl = 'http://localhost:4000';

describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('sendOrder');

    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', JSON.stringify('test-refresh-token'));

    cy.visit(hostUrl);
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

    it('TestOpeningAndClosingIngredientModal', () => {
    cy.get('[data-cy="ingredient-card"]').first().as('ingredientCard');
    cy.get('@ingredientCard').find('[data-cy="ingredient-name"]').invoke('text')
      .then((text) => {
        cy.get('@ingredientCard').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal-content"]').should('contain', text);
    });

    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('body').click(0, 0);
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('TestAddingBunToConstructor', () => {
    cy.get('[data-cy="bun-ingredient"]').should('be.visible');
    cy.get('[data-cy="bun-ingredient"]').contains('Добавить').click();
    
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  it('TestAddingMainIngredientToConstructor', () => {
    cy.get('[data-cy="mains-ingredient"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-main"]').should('have.length', 1);
  });

  it('TestAddingSauceIngredientToConstructor', () => {
    cy.get('[data-cy="sauces-ingredient"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-sauce"]').should('have.length', 1);
  });

  it('TestCreatingOrderWithSelectedIngredients', () => {
    cy.get('[data-cy="bun-ingredient"]').contains('Добавить').click();
    cy.get('[data-cy="mains-ingredient"]').contains('Добавить').click();
    cy.get('[data-cy="sauces-ingredient"]').contains('Добавить').click();
    
    cy.get('[data-cy="order-footer"]').contains('Оформить заказ').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.wait('@sendOrder');

    cy.get('[data-cy="order-number"]').should('contain', '12345');

    cy.get('[data-cy="modal-close-button"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-main"]').should('not.exist');
    cy.get('[data-cy="constructor-sauce"]').should('not.exist');
  });

});