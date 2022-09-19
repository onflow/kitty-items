const getIframeBody = () => {
  return cy
    .get('iframe[id="FCL_IFRAME"]')
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
}

/* 
Note on Cypress Testing on Testnet:
If we have a test account with pre-minted items and funding, how do we ensure that this account state is managed? For instance, every time the test runs, a new item would be minted on this account, and there doesn't seem to be a way to remove the item from store. We were able to clean up minted items on the emulator with the admin account, but can we do something similar in testnet?
*/

describe('Testnet tests', () => {

  describe('Scenarios that do not require calling external apps', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/')
    })

    afterEach(() => {
      cy.visit('http://localhost:3001/')
      // Verify that the user is logged out
      cy.get('[data-cy="btn-log-in"]').should('have.text', 'Log In')

      // Verify that the the state is back to home page
      cy.get('[data-cy="home-common"]').should('exist')
    })

    it("visits header buttons", () => {
      // Should be the same as homepage
      cy.get('[data-cy="header-right"]').contains('Store').click()
      cy.get('[data-cy="home-common"]').should('exist')

      cy.get('[data-cy="header-right"]').contains('Marketplace').click()
      cy.get('[data-cy="marketplace"]').contains('Marketplace').should('exist')

      // Click back to the homepage
      cy.get('[data-cy="header-left"]').click()
      cy.get('[data-cy="home-common"]').should('exist')
    });

    it('logs in as admin + mint an item', () => {
      cy.visit('http://localhost:3001/admin/mint')

      cy.get('[data-cy="btn-log-in-admin"]').click()
      cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
      cy.get("button[type=\"submit\"]").click()
  
      cy.get('[data-cy="header-mint"]').should('exist')
      cy.get('[data-cy="rarity-scale"]').should('exist')

      // Mint an item as admin
      cy.contains('Mint Item').click()
      cy.get('[data-cy="tx-loading"]',).should('be.visible')
      // Transaction could take longer than timeout (default, 4 seconds)
      cy.get('[data-cy="minted-item-name"]', { timeout:25000 } ).should('exist')
      // Purchase button doesn't exist because account is admin
    })

    it("connects to Blocto wallet", () => {
      cy.get('[data-cy="btn-log-in"]').click()

      // Connects to Blocto and triggers pop up for logging in
      getIframeBody().contains("Blocto").parent().click()

      // Prepare Pop-up page handling with Blocto
      /*
      cy.window().then((win) => {
        cy.stub(win, "open").as("popup")
      });
      */
      
      // TODO - Test that the popup shows up. The 'stub' method previously implemented was flaky (not passing on github actions) so more thorough debugging is required to test window popups. 
      // TODO - We eventually want to add test cases for funding, purchasing, listing, etc. These actions are dependent on external services (mainly, faucet). 
    })
  })
})