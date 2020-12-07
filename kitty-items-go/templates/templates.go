package templates

const MintKibblesTemplate = `
import DietKibbles from 0x06f65a4f32bba850
import FungibleToken from 0x9a0766d93b6608b7

transaction(to: Address, amount: UInt) {
  prepare() {
    getAccount(to)
      .getCapability<&{FungibleToken.Receiver}>(DietKibbles.publicPath)!
      .borrow()!
      .deposit(from: <- DietKibbles.mintTenDietKibbles())
  }
}
`
