import HomeEmptyMessage from "src/components/HomeEmptyMessage"
import LatestMarketplaceItems from "src/components/LatestMarketplaceItems"
import LatestStoreItems from "src/components/LatestStoreItems"
import PageTitle from "src/components/PageTitle"
import useApiListings from "src/hooks/useApiListings"
import {useEffect} from "react"
import {initWcAdapter} from "@onflow/fcl-wc"

export default function Home() {
  const {listings, isLoading} = useApiListings()

  useEffect(() => {
    const initWc = async () => {
      const wcAdapter = await initWcAdapter({
        projectId: "a94f744d745459d99b7e0f371663bce0",
      })
      console.log(wcAdapter)
    }
    initWc()
  }, [])

  return (
    <div>
      <PageTitle>Store</PageTitle>
      <main>
        {!isLoading &&
          (listings && listings.length > 0 ? (
            <>
              <LatestStoreItems items={listings} />
              <LatestMarketplaceItems items={listings} />
            </>
          ) : (
            <HomeEmptyMessage />
          ))}
      </main>
    </div>
  )
}
