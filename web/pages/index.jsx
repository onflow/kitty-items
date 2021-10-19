import LatestDrops from "src/components/LatestDrops"
import LatestMarketplaceItems from "src/components/LatestMarketplaceItems"
import PageTitle from "src/components/PageTitle"
import useApiSaleOffers from "src/hooks/useApiSaleOffers"

export default function Home() {
  const {saleOffers, isLoading} = useApiSaleOffers()
  return (
    <div>
      <PageTitle>Drops</PageTitle>
      <main>
        {saleOffers?.length > 0 && (
          <div className="divide-y divide-solid">
            <LatestDrops items={saleOffers} />
            <LatestMarketplaceItems items={saleOffers} />
          </div>
        )}
      </main>
    </div>
  )
}
