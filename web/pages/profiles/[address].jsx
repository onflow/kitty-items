import {useRouter} from "next/dist/client/router"
import PageTitle from "src/components/PageTitle"
import ProfileAccountItems from "src/components/ProfileAccountItems"
import ProfileSaleOffers from "src/components/ProfileSaleOffers"

export default function Marketplace() {
  const router = useRouter()
  const {address} = router.query

  if (!address) return null

  return (
    <div className="main-container">
      <PageTitle>Profile</PageTitle>
      {address}
      <main>
        <h1 className="text-4xl my-12">My Items</h1>
        <ProfileAccountItems address={address} />
        <h1 className="text-4xl my-12">Listed Items</h1>
        <ProfileSaleOffers address={address} />
      </main>
    </div>
  )
}
