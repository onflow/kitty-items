import {useRouter} from "next/router"
import Button from "src/components/Button"
import {paths} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useMintAndList from "src/hooks/useMintAndList"
import {useSWRConfig} from "swr"
import MinterLoader from "./MinterLoader"
import RarityScale from "./RarityScale"
import TransactionLoading from "./TransactionLoading"

export default function Minter() {
  const router = useRouter()
  const {mutate} = useSWRConfig()

  const onSuccess = itemId => {
    // Wait for new listing to be created by the API
    // Mutations don't work because they get overwritten when the new page is loaded
    setTimeout(() => {
      mutate(paths.apiMarketItemsList())
      router.push({
        pathname: paths.profileItem(publicConfig.flowAddress, itemId),
        query: {flash: "itemMintedSuccess"},
      })
    }, 1000)
  }

  const [{isLoading, transactionStatus}, mint] =
    useMintAndList(onSuccess)

  const onClickMint = () => mint()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <MinterLoader isLoading={isLoading} />

      <div className="flex flex-col pr-4 mt-14 lg:mt-24 lg:pt-20 lg:pl-14">
        <h1 className="mb-10 text-5xl text-gray-darkest">Mint a New Item</h1>
        <RarityScale />

        {isLoading ? (
          <TransactionLoading status={transactionStatus} />
        ) : (
          <Button onClick={onClickMint} disabled={isLoading} roundedFull={true}>
            Mint Item
          </Button>
        )}
      </div>
    </div>
  )
}
