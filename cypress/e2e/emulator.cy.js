describe('Emulator + dev-wallet tests', () => {
  
  const getIframeDocument = () => {
    return cy
    .get('iframe[id="FCL_IFRAME"]')
    // Cypress yields jQuery element, which has the real
    // DOM element under property "0".
    // From the real DOM iframe element we can get
    // the "document" element, it is stored in "contentDocument" property
    // Cypress "its" command can access deep properties using dot notation
    // https://on.cypress.io/its
    .its('0.contentDocument').should('exist')
  }
  
  const getIframeBody = () => {
    // get the document
    return getIframeDocument()
    // automatically retries until body is loaded
    .its('body').should('not.be.undefined')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    .then(cy.wrap)
  }

  it('Visit main page', () => {
    cy.visit('http://localhost:3001/')
  })
  
  it('Mint new item', () => {
    // this only works if there's 100% guarantee
    // body has fully rendered without any pending changes
    // to its state
    cy.get('body').then(($body) => {
      // synchronously ask for the body's text
      // and do something based on whether it includes
      // another string
      if ($body.text().includes('MINT YOUR FIRST KITTY ITEM')) {
        // yup found it
        cy.contains('MINT YOUR FIRST KITTY ITEM').click()
        cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
        cy.get("button[type=\"submit\"]").click()
        cy.contains('Mint Item').click()
      } else {
        // nope not here
        cy.contains('Latest Kitty Items').should('exist')
      }
    })
  })

  it('Create new account', () => {
    cy.visit('http://localhost:3001/')
    
    cy.contains('Log In').click()
    // Dev wallet runs in iframe
    getIframeBody().contains('Create New Account').click()
    getIframeBody().contains('button', 'Create').click()
  })

  it('Fund account', () => {
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