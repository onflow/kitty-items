import LatestDrops from "src/components/LatestDrops"
import LatestMarketplaceItems from "src/components/LatestMarketplaceItems"
import PageTitle from "src/components/PageTitle"
import useMarketplaceItems from "src/hooks/useMarketplaceItems"

export default function Home() {
  const {items, isLoading} = useMarketplaceItems()

  return (
    <div>
      <PageTitle>Drops</PageTitle>
      <main>
        {isLoading && "Loading..."}
        {items?.length > 0 && (
          <>
            <LatestDrops items={items} />
            <LatestMarketplaceItems items={items} />
          </>
        )}
      </main>
    </div>
  )
}
