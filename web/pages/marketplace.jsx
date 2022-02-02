import Link from "next/link"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import ListItems from "src/components/ListItems"
import MarketplaceFilters from "src/components/MarketplaceFilters"
import PageTitle from "src/components/PageTitle"
import Pagination from "src/components/Pagination"
import {paths} from "src/global/constants"
import useApiListings from "src/hooks/useApiListings"
import useAppContext from "src/hooks/useAppContext"
import {cleanObject} from "src/util/object"

const PER_PAGE = 12

const MainContent = ({queryState}) => {
  const router = useRouter()

  const {currentUser} = useAppContext()

  const {listings, data} = useApiListings({
    ...queryState,
    marketplace: true,
  })

  const updateQuery = payload => {
    const newQueryObject = {...queryState, ...payload}
    router.push({
      pathname: router.pathname,
      query: cleanObject({
        ...newQueryObject,
        page: newQueryObject.page === 1 ? undefined : newQueryObject.page,
      }),
    })
  }

  const onPageClick = newPage => updateQuery({page: newPage})

  return (
    <div className="main-container py-14">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl text-gray-darkest">Marketplace</h1>
        {!!currentUser && (
          <Link href={paths.profile(currentUser.addr)}>
            <a className="rounded uppercase font-bold text-sm rounded-full bg-green hover:opacity-80 py-2.5 px-5">
              List My Kitty Items
            </a>
          </Link>
        )}
      </div>

      <hr className="pt-1 mb-8" />

      <MarketplaceFilters queryState={queryState} updateQuery={updateQuery} />

      {!!listings && <ListItems items={listings} />}

      {data?.total !== undefined && (
        <Pagination
          currentPage={queryState.page}
          total={data.total}
          perPage={PER_PAGE}
          onPageClick={onPageClick}
        />
      )}
    </div>
  )
}

export default function Marketplace() {
  const router = useRouter()

  const [queryState, setQueryState] = useState()

  useEffect(() => {
    if (router.isReady) {
      setQueryState({
        ...router.query,
        page: Number(router.query.page || 1),
      })
    }
  }, [router])

  return (
    <div>
      <PageTitle>Marketplace</PageTitle>
      <main>
        <div>
          {typeof queryState !== "undefined" && (
            <MainContent queryState={queryState} />
          )}
        </div>
      </main>
    </div>
  )
}
