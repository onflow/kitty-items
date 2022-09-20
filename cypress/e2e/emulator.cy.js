const getIframeBody = () => {
  return cy
    .get('iframe[id="FCL_IFRAME"]')
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
};

describe("Emulator + dev-wallet tests", () => {
  describe("Scenarios that do not interact with kitty items", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3001/");
    });

    it("visits header buttons", () => {
      // Should be the same as homepage
      cy.get('[data-cy="header-right"]').contains("Store").click();
      cy.get('[data-cy="home-common"]').should("exist");

      cy.get('[data-cy="header-right"]').contains("Marketplace").click();
      cy.get('[data-cy="marketplace"]').contains("Marketplace").should("exist");

      // Click back to the homepage
      cy.get('[data-cy="header-left"]').click();
      cy.get('[data-cy="home-common"]').should("exist");
    });

    it("logs in as admin", () => {
      cy.visit("http://localhost:3001/admin/mint");

      cy.get('[data-cy="btn-log-in-admin"]').click();
      cy.get('input[placeholder="Enter Password"]').type("KittyItems");
      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="header-mint"]').should("exist");
      cy.get('[data-cy="rarity-scale"]').should("exist");
      cy.contains("Mint Item").should("exist");
    });

    it("creates a new account", () => {
      cy.get('[data-cy="btn-log-in"]').click();

      // Creates a new account
      // FCL wallet runs in iframe, and we can currently only access the elements by searching for its contents, rather
      // than labelling elements like data-cy=... Adding data tags would require changeg in FCL
      getIframeBody().contains("Create New Account").click();
      getIframeBody().contains("button", "Create").click();
      getIframeBody().contains("Account Created").should("exist");
    });
  });

  describe("Scenarios that involve minting kitty items", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3001/");
    });

    afterEach(() => {
      // Sign out from any account
      cy.get('[data-cy="btn-user-account"]').click();
      cy.get('[data-cy="btn-sign-out"]').should("have.text", "Sign Out");
      cy.get('[data-cy="btn-sign-out"]').click();
      cy.get('[data-cy="btn-log-in"]').should("have.text", "Log In");

      // Check that the store is empty
      cy.visit("http://localhost:3001/");
      cy.contains("MINT YOUR FIRST KITTY ITEM").should("exist");
    });

    it("mints an item as a user + funds an account + purchases item", () => {
      // Mints an item - alreay signed in with service account
      cy.contains("MINT YOUR FIRST KITTY ITEM").click();
      cy.get('input[placeholder="Enter Password"]').type("KittyItems");
      cy.get('button[type="submit"]').click();

      cy.contains("Mint Item").click();
      cy.get('[data-cy="tx-loading"]').should("be.visible");

      cy.get('[data-cy="header-mint"]').should("exist");
      cy.get('[data-cy="rarity-scale"]').should("exist");
      cy.contains("Purchase");

      cy.get('[data-cy="minted-item-name"]').then(($it) => {
        let itemName = $it.text();

        // Funds Account A
        cy.get('[data-cy="btn-log-in"]').click();

        getIframeBody()
          .contains("Account A")
          .parent()
          .contains("Manage")
          .click();
        
        getIframeBody()
          .contains("label", "FLOW")
          .next()
          .invoke("text")
          .should("not.eq", "0")
          .then(($it) => {
            let prevFund = parseFloat($it.replace(",", "")) // The first prevFund is initial fund e.g. 0.001
            
            for (let n = 0; n < 3; n++) {
              let currFund = prevFund + 100;
              getIframeBody().contains("label", "FLOW").next().next().click();
              getIframeBody()
                .contains("label", "FLOW")
                .next()
                .invoke("text")
                .should("not.eq", "0")
                .and("not.eq", prevFund.toString());
              // The above line seems redundant, but the should condition ensures to retry until non-default values and non-previous values are loaded
    
              getIframeBody()
                .debug()
                .contains("label", "FLOW")
                .next()
                .invoke("text")
                .then(($text) => {
                  const funds = parseFloat($text.replace(",", ""));
                  expect(funds).to.be.equal(currFund);
                });
              prevFund = currFund;
            }
            // We can exit the .then() blocks because we have finished using 'it' (prevFund)
          })
        getIframeBody()
          .debug()
          .contains("label", "FLOW")
          .next()
          .invoke("text")
          .then(($text) => {
            const funds = parseFloat($text.replace(",", ""));
            expect(funds).to.be.greaterThan(300);
          });

        getIframeBody().contains("Save").click();

        // Sign in to Account A
        getIframeBody().contains("Account A").click();

        // Purchases this item from store
        cy.visit("http://localhost:3001/");
        cy.contains(itemName).click();
        cy.get('[data-cy="rarity-scale"]').should("exist");
        // We can exit the .then() blocks because we have finished using 'itemName'
      })

      cy.contains("Purchase")
        .click()
        .then(() => {
          getIframeBody().should("be.visible");
          getIframeBody().contains("Approve").click();
        });
      cy.get('[data-cy="sell-list-item"]').should("exist");

      // Since a user bought a list item, there is no need to remove from store as a part of cleanup. Note that we should ideally undo funding for Account A, but there is no way to do this with e2e capabilities    
    });

    it("mints first item from a service account + remove from store", () => {
      // Sign in to service account
      cy.get('[data-cy="btn-log-in"]').should("have.text", "Log In");
      cy.get('[data-cy="btn-log-in"]').click();
      getIframeBody().contains("Service Account").click();
      cy.visit("http://localhost:3001/");

      cy.contains("MINT YOUR FIRST KITTY ITEM").click();
      cy.get('input[placeholder="Enter Password"]').type("KittyItems");
      cy.get('button[type="submit"]').click();

      cy.contains("Mint Item").click();
      cy.get('[data-cy="tx-loading"]').should("be.visible");

      cy.get('[data-cy="header-mint"]').should("exist");
      cy.get('[data-cy="rarity-scale"]').should("exist");
      cy.contains("Remove From Store").click();

      getIframeBody().contains("Approve").click();
      cy.get('[data-cy="sell-list-item"]').should("exist");
    });
  });
});
