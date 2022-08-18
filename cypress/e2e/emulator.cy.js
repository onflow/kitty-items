describe('Emulator + dev-wallet tests', () => {
  
  const getIframeBody = () => {
    return cy
      .get('iframe[id="FCL_IFRAME"]')
      .its('0.contentDocument.body').should('not.be.empty')
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      // https://on.cypress.io/wrap
      .then(cy.wrap)
  }

  it('visit main page', () => {
    cy.visit('http://localhost:3001/')
  })

  it('mints first item from home page or views minted items', () => {
    cy.visit('http://localhost:3001/')
    cy.get('body').then(($body) => {
      if ($body.text().includes('MINT YOUR FIRST KITTY ITEM')) {
        // Initial empty state where no items have been minted yet
        cy.contains('MINT YOUR FIRST KITTY ITEM').click()
        cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
        cy.get("button[type=\"submit\"]").click()

        cy.contains('Mint Item').click()

        // Optional, add loading check 
        cy.get('[data-cy="header mint"').should('exist')
        cy.get('[data-cy="rarity scale"').should('exist')
        cy.contains(/Purchase|(Remove From (Store|MarketPlace))/)
      } else {
        // State where at least one kitty item has been minted on the marketplace
        cy.contains('Latest Kitty Items')
      }
    })
  })

  it('mints first item as admin', () => {
    cy.visit('http://localhost:3001/admin/mint')
    cy.get('[data-cy="btn log in admin"]').click()
    cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
    cy.get("button[type=\"submit\"]").click()

    cy.get('[data-cy="header mint"').should('exist')
    cy.get('[data-cy="rarity scale"').should('exist')

    cy.contains('Mint Item').click()

    // Optional, add loading check 
    cy.contains(/Purchase|(Remove From (Store|MarketPlace))/)
  })

  it('creates a new account', () => {
    cy.contains('Log In').click()
    // Dev wallet runs in iframe
    getIframeBody().contains('Create New Account').click()
    getIframeBody().contains('button', 'Create').click()
  })

  it('funds an account', () => {
    // Dev wallet runs in iframe
    getIframeBody().contains('Account A')
    .parent().parent()
    .find('button').contains('Manage')
    .debug().click()
    const fund = getIframeBody().contains('button', 'Fund')
    fund.click()
    // There is a bug with flow-cli init that fails the test, bump version to fix
    // fund.prev().debug().pause().invoke('text').debug().then(parseFloat).should('be.gt', 100)
  })
  
})