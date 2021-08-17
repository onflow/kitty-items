import {useEffect} from "react"
import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {sansPrefix} from "@onflow/fcl"
import {IDLE, PROCESSING} from "../global/constants"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {useAccountItems} from "../hooks/use-account-items.hook"
import {useFUSDBalance} from "../hooks/use-fusd-balance.hook"
import {fetchMarketItem} from "../flow/script.get-market-item"
import {buyMarketItem} from "../flow/tx.buy-market-item"
import {cancelMarketListing} from "../flow/tx.remove-sale-offer"
import {useMarketItems} from "../hooks/use-market-items.hook"

function expand(key) {
  return key.split("|")
}

function comp(address, id) {
  return [address, id].join("|")
}

export const $state = atomFamily({
  key: "market-item::state",
  default: selectorFamily({
    key: "market-item::default",
    get: key => async () => await fetchMarketItem(...expand(key)),
  }),
})

export const $status = atomFamily({
  key: "market-item::status",
  default: IDLE,
})

export function useMarketItem(address, id) {
  const [cu] = useCurrentUser()
  const ownerItems = useAccountItems(address)
  const cuItems = useAccountItems(cu.addr)
  const marketItems = useMarketItems()
  const fusd = useFUSDBalance(cu.addr)
  const key = comp(address, id)
  const [item, setItem] = useRecoilState($state(key))
  const [status, setStatus] = useRecoilState($status(key))
  const owned = sansPrefix(cu.addr) === sansPrefix(address)

  useEffect(() => {
    fetchMarketItem(...expand(key)).then(setItem)
  }, [])

  return {
    ...item,
    status,
    owned,
    async buy() {
      await buyMarketItem(
        {itemID: id, ownerAddress: address},
        {
          onStart() {
            setStatus(PROCESSING)
          },
          async onSuccess() {
            if (address !== cu.addr) {
              ownerItems.refresh()
            }
            cuItems.refresh()
            fusd.refresh()
          },
          async onComplete() {
            setStatus(IDLE)
          },
          async onError(error) {
            // TODO: Handle error
          },
        }
      )
    },
    async cancelListing() {
      const saleOfferResourceID = marketItems.findSaleOffer(
        item ? item.itemID : id
      )

      await cancelMarketListing(
        {saleOfferResourceID: saleOfferResourceID},
        {
          onStart() {
            setStatus(PROCESSING)
          },
          async onSuccess() {
            if (address !== cu.addr) {
              ownerItems.refresh()
            }
            cuItems.refresh()
            fusd.refresh()
          },
          async onComplete() {
            setStatus(IDLE)
          },
          async onError(error) {
            // TODO: Handle error
          },
        }
      )
    },
    async refresh() {
      setStatus(PROCESSING)
      await fetchMarketItem(...expand(key)).then(setItem)
      setStatus(IDLE)
    },
  }
}
