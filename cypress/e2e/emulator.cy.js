describe('Emulator + dev-wallet tests', () => {
  
  const getIframeBody = () => {
    return cy
      .get('iframe[id="FCL_IFRAME"]')
      .its('0.contentDocument.body').should('not.be.empty')
      .then(cy.wrap)
  }

  beforeEach(() => {
    cy.visit('http://localhost:3001/')
    /*cy.get('[data-cy="btn user account"]').click()
    cy.contains('button', 'Sign Out').click()*/
  })

  it('logs in as admin', () => {
    cy.visit('http://localhost:3001/admin/mint')

    cy.get('[data-cy="btn log in admin"]').click()
    cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
    cy.get("button[type=\"submit\"]").click()

    cy.get('[data-cy="header mint"]').should('exist')
    cy.get('[data-cy="rarity scale"]').should('exist')
    cy.contains('Mint Item').should('exist')
  })

  it('mints first item as user from home page or views minted items', () => {
    // There are two possible components that loads for home page: 'HomeEmptyMessage' or 'LatestStoreItems'
    cy.get('[data-cy="home"]').then(($home) => {
      if ($home.text().includes('MINT YOUR FIRST KITTY ITEM')) {
        // State 1: HomeEmptyMessage - initial empty state where no items have been minted yet
        cy.contains('MINT YOUR FIRST KITTY ITEM').click()
        cy.get("input[placeholder=\"Enter Password\"]").type('KittyItems')
        cy.get("button[type=\"submit\"]").click()

        cy.contains('Mint Item').click()

        cy.get('[data-cy="header mint"]').should('exist')
        cy.get('[data-cy="rarity scale"]').should('exist')
        cy.contains(/Purchase|(Remove From (Store|MarketPlace))/) // This depends on whether you are logged on to the service account or not.
      } else {
        // State 2: LatestStoreItems - where at least one kitty item has been minted on the marketplace. If developer has already minted items prior to the cypress test, this state will show as default the home page.
        cy.contains('Latest Kitty Items')
      }
    })
  })

  it('creates a new account', () => {
    cy.get('[data-cy="btn log in"]').click()

    // Creates a new account
    // FCL wallet runs in iframe, and we can currently only access the elements by searching for its contents, rather
    // than labelling elements like data-cy=... Adding data tags would require changeg in FCL
    getIframeBody().contains('Create New Account').click()
    getIframeBody().contains('button', 'Create').click()
    getIframeBody().contains('Account Created').should('exist')
  })

  it('log in and out of user account', () => {
    cy.get('[data-cy="btn log in"]').should('have.text', 'Log In')
    cy.get('[data-cy="btn log in"]').click()
    
    // TODO: We should add data tags to components in FCL repositories, so that we don't traverse items through like this. FCL wallet runs in iframe, and we can currently only access the elements by searching for its contents, rather than labelling elements like data-cy=... Adding data tags would require changeg in FCL
    getIframeBody().contains('Account A').click()

    cy.get('[data-cy="user avatar"]')
    cy.contains('button', 'My Items').should('exist')
    cy.contains('button', 'Listed Items').should('exist')

    // Logs out to remove dependencies between tests
    cy.get('[data-cy="btn user account"]').click()
    cy.contains('button', 'Sign Out').click()
    cy.get('[data-cy="btn log in"]').should('have.text', 'Log In')
  })
  
  it('funds an account and purchases minted items', () => {
    // Funds Account A
    cy.get('[data-cy="btn log in"]').click()

    getIframeBody().contains('Account A').parent().contains('Manage').click()

    getIframeBody().contains('label', 'FLOW').next().next().click().click().click().click().click()  // Funds 500 button
    getIframeBody().contains('label', 'FLOW').next().invoke('text').should('not.eq', '0').and('not.eq','0.001') 
    // The above line seems redundant, but the should condition ensures to retry until non-default values are loaded
    getIframeBody().contains('label', 'FLOW').next().invoke('text').then(text => {
      const funds = parseFloat(text.replace(',', ''))
      expect(funds).to.be.greaterThan(500)
    })

    getIframeBody().contains('Save').click()

    cy.visit('http://localhost:3001/') // Revisit /store or home page, which are equivalent paths
  })
})