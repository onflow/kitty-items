import Button from "src/components/Button"
import useMintAndList from "src/hooks/useMintAndList"
import MinterLoader from "./MinterLoader"
import RarityScale from "./RarityScale"
import TransactionLoading from "./TransactionLoading"

export default function Minter() {
  const [{isLoading, transactionStatus}, mint] = useMintAndList()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <MinterLoader isLoading={isLoading} />

      <div className="flex flex-col pr-4 mt-14 lg:mt-24 lg:pt-20 lg:pl-14">
        <h1 className="mb-10 text-5xl text-gray-darkest">Mint a New Item</h1>
        <RarityScale />

        {isLoading ? (
          <TransactionLoading status={transactionStatus} />
        ) : (
          <Button onClick={mint} disabled={isLoading} roundedFull={true}>
            Mint Item
          </Button>
        )}
      </div>
    </div>
  )
}
