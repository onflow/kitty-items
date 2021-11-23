import LatestMarketplaceItems from "src/components/LatestMarketplaceItems"
import LatestStoreItems from "src/components/LatestStoreItems"
import PageTitle from "src/components/PageTitle"
import useApiSaleOffers from "src/hooks/useApiSaleOffers"

export default function Home() {
  const {saleOffers} = useApiSaleOffers()
  return (
    <div>
      <PageTitle>Store</PageTitle>
      <main>
        {saleOffers?.length > 0 && (
          <div className="divide-y divide-solid">
            <LatestStoreItems items={saleOffers} />
            <LatestMarketplaceItems items={saleOffers} />
          </div>
        )}
      </main>
    </div>
  )
}
