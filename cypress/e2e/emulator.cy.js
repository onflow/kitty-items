const { hasUncaughtExceptionCaptureCallback } = require("process")

describe('Emulator + dev-wallet tests', () => {
  
  const getIframeBody = () => {
    return cy
      .get('iframe[id="FCL_IFRAME"]')
      .its('0.contentDocument.body').should('not.be.empty')
      .then(cy.wrap)
  }

  beforeEach(() => {
    cy.visit('http://localhost:3001/')
  })

  it('log in as admin', () => {
    cy.visit('http://localhost:3001/admin/mint')
    cy.get('[data-cy="btn log in admin"]').click()
    cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
    cy.get("button[type=\"submit\"]").click()

    cy.get('[data-cy="header mint"]').should('exist')
    cy.get('body').find('[data-cy="rarity scale"]')
    cy.get('[data-cy="rarity scale"]').should('exist')
    cy.contains('Mint Item').should('exist')
    // Minting is tested in the below item
  })

  it('mints first item from home page or views minted items', () => {
    cy.visit('http://localhost:3001/')
    cy.get('[data-cy="home"]').then(($home) => {
      if ($home.text().includes('MINT YOUR FIRST KITTY ITEM')) {
        // Initial empty state where no items have been minted yet
        cy.contains('MINT YOUR FIRST KITTY ITEM').click()
        cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
        cy.get("button[type=\"submit\"]").click()

        cy.contains('Mint Item').click()

        cy.get('[data-cy="header mint"]').should('exist')
        cy.get('[data-cy="rarity scale"]').should('exist')
        cy.contains(/Purchase|(Remove From (Store|MarketPlace))/)
      } else {
        /* State where at least one kitty item has been minted on the marketplace. If developer has already minted items prior to the cypress test, this state will show as default the home page.*/
        cy.contains('Latest Kitty Items')
      }
    })
  })

  it('creates and funds a new account', () => {
    cy.get('[data-cy="btn log in"]').click()

    // FCL wallet runs in iframe, and we can currently only access the elements by searching for its contents, rather
    // than labelling elements like data-cy=... Adding data tags would require changeg in FCL
    getIframeBody().contains('Create New Account').click()
    getIframeBody().contains('button', 'Create').click()
    getIframeBody().contains('Account Created').should('exist')

    getIframeBody().contains('Account A')
      .parent().parent()
      .find('button').contains('Manage')
      .click()

    // Following best practices as guided: https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures
    getIframeBody().contains('label', 'FLOW').next().then(($fundAmount) => {
      const initialFund = $fundAmount.text() // TODO: This always reads '0' due to the default zero value being displayed before the actual fund amount. Since '0' could also be the actual fund amount at the start, we need to find a way to ensure the correct fund amount is read.
      
      $fundAmount.next().click()

      getIframeBody().contains('label', 'FLOW').next().should(($fundAmount2) => {
        expect($fundAmount2.text()).not.to.eq(initialFund)
      })
    })
    //cy.log(getIframeBody().contains('label', 'FLOW').next().should('have.text', 'abc'))
  })
  
})