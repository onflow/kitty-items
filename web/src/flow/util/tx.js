import * as fcl from "@onflow/fcl"

const noop = async () => {}

export async function tx(mods = [], opts = {}) {
  const onStart = opts.onStart || noop
  const onSubmission = opts.onSubmission || noop
  const onUpdate = opts.onUpdate || noop
  const onSuccess = opts.onSuccess || noop
  const onError = opts.onError || noop
  const onComplete = opts.onComplete || noop

  try {
    onStart()
    var txId = await fcl.mutate({
      cadence: mods.cadence,
      args: mods.args,
      payer: mods.payer,
      proposer: mods.proposer,
      authorizations: mods.authorizations,
      limit: mods.limit,
    })
    console.info(
      `%cTX[${txId}]: ${fvsTx(await fcl.config().get("env"), txId)}`,
      "color:purple;font-weight:bold;font-family:monospace;"
    )
    onSubmission(txId)
    var unsub = await fcl.tx(txId).subscribe(onUpdate)
    var txStatus = await fcl.tx(txId).onceSealed()
    unsub()
    console.info(
      `%cTX[${txId}]: ${fvsTx(await fcl.config().get("env"), txId)}`,
      "color:green;font-weight:bold;font-family:monospace;"
    )
    await onSuccess(txStatus)
    return txStatus
  } catch (error) {
    console.error(
      `TX[${txId}]: ${fvsTx(await fcl.config().get("env"), txId)}`,
      error
    )
    onError(error)
  } finally {
    await onComplete()
  }
}

function fvsTx(env, txId) {
  return `https://flow-view-source.com/${env}/tx/${txId}`
}
