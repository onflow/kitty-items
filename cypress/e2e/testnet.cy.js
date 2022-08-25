const getIframeBody = () => {
  return cy
    .get('iframe[id="FCL_IFRAME"]')
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
}

describe('Testnet tests', () => {

  describe.skip('Scenarios that do not require calling external apps', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/')
    })

    it('visits header buttons', () => {
      // Should be the same as homepage
      cy.get('[data-cy="header right"]').contains('Store').click()
      cy.get('[data-cy="home"]').contains('MINT YOUR FIRST KITTY ITEM')

      cy.get('[data-cy="header right"]').contains('Marketplace').click()
      cy.get('[data-cy="marketplace"]').contains('Marketplace').should('exist')

      // Click back to the homepage
      cy.get('[data-cy="header left"]').click()
      cy.get('[data-cy="home"]').contains('MINT YOUR FIRST KITTY ITEM')
    })

    it('logs in as admin + mint an item', () => {
      cy.visit('http://localhost:3001/admin/mint')

      cy.get('[data-cy="btn log in admin"]').click()
      cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
      cy.get("button[type=\"submit\"]").click()
  
      cy.get('[data-cy="header mint"]').should('exist')
      cy.get('[data-cy="rarity scale"]').should('exist')

      // Mint an item as admin
      cy.contains('Mint Item').click()
      cy.get('[data-cy="tx loading').should('be.visible')
      // Transaction could take longer than timeout (default, 4 seconds)
      cy.wait(15000)
      cy.contains('Purchase').should('exist')
    })

    it('connects to Blocto wallet with testnet account', () => {
      cy.get('[data-cy="btn log in"]').click()
  
      // Prepare Pop-up page handling with Blocto
      cy.window().then((win) => {
        cy.stub(win, 'open', url => {
          win.location.href = 'https://flow-wallet-testnet.blocto.app/authn';
        }).as('popup')
      })

      // Connects to Blocto and triggers pop up
      getIframeBody().contains('Blocto').parent().click()
      cy.get('@popup').should('be.called')

      // The steps after this point involves FCL wallet apis (for blockto and lilico)
      // TODO: Investigate whether this behaviour could be mocked for KI testing
    })
  })
})