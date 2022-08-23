const getIframeBody = () => {
  return cy
    .get('iframe[id="FCL_IFRAME"]')
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
}

describe('Emulator + dev-wallet tests', () => {

  describe('Scenarios that do not require user accounts', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/')
    })

    it('logs in as admin', () => {
      /*cy.get('[data-cy="btn user account"]').click()
      cy.get('[data-cy="btn sign out"]').should('have.text', 'Sign Out')
      cy.get('[data-cy="btn sign out"]').click()*/

      cy.visit('http://localhost:3001/admin/mint')
      //cy.contains('Back to user view').click()

      cy.get('[data-cy="btn log in admin"]').click()
      cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
      cy.get("button[type=\"submit\"]").click()
  
      cy.get('[data-cy="header mint"]').should('exist')
      cy.get('[data-cy="rarity scale"]').should('exist')
      cy.contains('Mint Item').should('exist')
    })

    // List and remove item from as admin
    it('creates a new account', () => {
      cy.get('[data-cy="btn log in"]').click()
  
      // Creates a new account
      // FCL wallet runs in iframe, and we can currently only access the elements by searching for its contents, rather
      // than labelling elements like data-cy=... Adding data tags would require changeg in FCL
      getIframeBody().contains('Create New Account').click()
      getIframeBody().contains('button', 'Create').click()
      getIframeBody().contains('Account Created').should('exist')
    })
  })

  describe('Scenarios that require user accounts', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/')
    })

    afterEach(()=> {
      // Sign out from any account
      cy.get('[data-cy="btn user account"]').click()
      cy.wait(1000)
      cy.get('[data-cy="btn sign out"]').should('have.text', 'Sign Out')
      cy.get('[data-cy="btn sign out"]').click()
      cy.get('[data-cy="btn log in"]').should('have.text', 'Log In')

      // Check that the store is empty
      cy.visit('http://localhost:3001/')
      cy.contains('MINT YOUR FIRST KITTY ITEM').should('exist')
    })

    it('mints first item as user then remove from store', () => {
      // Sign in to service account
      cy.get('[data-cy="btn log in"]').should('have.text', 'Log In')
      cy.get('[data-cy="btn log in"]').click()
      getIframeBody().contains('Service Account').click()
      cy.visit('http://localhost:3001/')

      cy.contains('MINT YOUR FIRST KITTY ITEM').click()
      cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
      cy.get("button[type=\"submit\"]").click()

      cy.contains('Mint Item').click()

      cy.get('[data-cy="header mint"]').should('exist')
      cy.get('[data-cy="rarity scale"]').should('exist')
      cy.contains('Remove From Store').click()

      getIframeBody().contains('Approve').click()
      cy.get('[data-cy="sell list item"]').should('exist')
    })

    it('mints an item + funds an account + purchases item from the funded account', () => {
      // Mints an item - alreay signed in with service account
      cy.contains('MINT YOUR FIRST KITTY ITEM').click()
      cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
      cy.get("button[type=\"submit\"]").click()

      cy.contains('Mint Item').click()

      cy.get('[data-cy="header mint"]').should('exist')
      cy.get('[data-cy="rarity scale"]').should('exist')
      cy.contains('Purchase')

      cy.get('[data-cy="minted item name"]').then(($item) => {
        const itemName = $item.text()
        
        // Funds Account A
        cy.get('[data-cy="btn log in"]').click()
    
        getIframeBody().contains('Account A').parent().contains('Manage').click()

        for (let n = 0; n < 5; n ++) {
          getIframeBody().contains('label', 'FLOW').next().next().click()
          cy.wait(1000)
        }
        getIframeBody().contains('label', 'FLOW').next().invoke('text').should('not.eq', '0').and('not.eq','0.001') 
        // The above line seems redundant, but the should condition ensures to retry until non-default values are loaded
        getIframeBody().contains('label', 'FLOW').next().invoke('text').then($text => {
          const funds = parseFloat($text.replace(',', ''))
          expect(funds).to.be.greaterThan(500)
        })
        getIframeBody().contains('Save').click()

        // Sign in to Account A
        getIframeBody().contains('Account A').click()

        // Purchases this item from store
        cy.visit('http://localhost:3001/')
        cy.contains(itemName).click()
        cy.contains('Purchase').click()
        getIframeBody().contains('button', 'Approve').click()
        cy.get('[data-cy="sell list item"]').should('exist')

        // Since a user bought a liste item, there is no need to remove from store as a part of cleanup. Note that we should ideally undo funding for Account A, but there is no way to do this with e2e capabilities
      })
    })
  })
})