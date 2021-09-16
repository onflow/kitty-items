import FUSD from "../../contracts/FUSD.cdc"

transaction {

  prepare(account: AuthAccount) {
        
    destroy account.load<@FUSD.MinterProxy>(from: FUSD.MinterProxyStoragePath)
    destroy account.load<@FUSD.Administrator>(from: FUSD.AdminStoragePath)
    destroy account.load<@FUSD.Vault>(from: /storage/fusdVault)

    account.unlink(/public/fusdReceiver)
    account.unlink(/public/fusdVault)
    account.unlink(FUSD.MinterProxyPublicPath)


  }
}
