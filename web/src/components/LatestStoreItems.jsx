import PropTypes from "prop-types"
import {useMemo, useRef, useState} from "react"
import ListItem from "src/components/ListItem"
import publicConfig from "src/global/publicConfig"
import {storeItemsSelector} from "src/global/selectors"
import {useDebouncedCallback} from "use-debounce"

const ITEMS_LENGTH = 10
const ITEM_WIDTH = 362

const PageButton = ({onClick, disabled, children}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="rounded-full border border-gray-200 h-14 w-14 flex items-center justify-center bg-white hover:opacity-80 disabled:opacity-50 disabled:cursor-default"
  >
    {children}
  </button>
)

export default function LatestStoreItems({items}) {
  const listRef = useRef()
  const [scrollLeft, setScrollLeft] = useState(0)

  const storeItems = storeItemsSelector(items)
    .slice(0, ITEMS_LENGTH)
    .sort((a, b) => b.itemID - a.itemID)

  const firstVisibleItem = useMemo(
    () => Math.ceil(scrollLeft / ITEM_WIDTH),
    [scrollLeft]
  )

  const reachedScrollEnd = useMemo(
    () =>
      listRef.current
        ? scrollLeft + listRef.current.offsetWidth >=
          listRef.current.scrollWidth
        : false,
    [scrollLeft]
  )

  const onDebouncedScroll = useDebouncedCallback(
    e => setScrollLeft(e.target.scrollLeft),
    200
  )

  if (storeItems.length === 0) return null

  const scrollToItem = index =>
    listRef.current?.scrollTo({
      top: 0,
      left: index * ITEM_WIDTH,
      behavior: "smooth",
    })

  const prevPage = () => scrollToItem(firstVisibleItem - 1)
  const nextPage = () => scrollToItem(firstVisibleItem + 1)

  return (
    <div className="grid grid-cols-12 md:gap-10" style={{minHeight: 550}}>
      <div className="col-span-12 lg:col-span-4 3xl:col-span-5 flex relative items-center pl-4 2xl:latest-store-items-left-content">
        <div className="">
          <h1 className="text-5xl lg:text-6xl text-gray-darkest mb-6 mt-10 lg:mt-0">
            Latest items
          </h1>
          <div className="text-gray sm:max-w-2xl lg:max-w-sm">
            Check out the latest freshly-minted Kitty Items.
          </div>
          {storeItems.length > 2 && (
            <div className="flex mt-8">
              <div className="mr-5">
                <PageButton onClick={prevPage} disabled={scrollLeft === 0}>
                  <img
                    src="/images/arrow-left.svg"
                    alt="Previous Page"
                    width="16"
                    height="16"
                  />
                </PageButton>
              </div>
              <PageButton onClick={nextPage} disabled={reachedScrollEnd}>
                <img
                  src="/images/arrow-right.svg"
                  alt="Next Page"
                  width="16"
                  height="16"
                />
              </PageButton>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 3xl:col-span-7 lg:l-3 my-10 ">
        <div
          className="overflow-x-scroll"
          onScroll={onDebouncedScroll}
          ref={listRef}
        >
          <div className="whitespace-nowrap flex lg:pr-3 lg:pl-4">
            {storeItems.map(item => (
              <div
                key={item.itemID}
                className="flex justify-center px-4"
                style={{width: ITEM_WIDTH}}
              >
                <ListItem
                  address={publicConfig.flowAddress}
                  id={item.itemID}
                  price={item.price}
                  listingId={item.resourceID}
                  size="sm"
                  isStoreItem={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

LatestStoreItems.propTypes = {
  items: PropTypes.array.isRequired,
}

PageButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
}
