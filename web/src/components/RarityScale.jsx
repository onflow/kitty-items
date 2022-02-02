import PropTypes from "prop-types"
import {ITEM_RARITY_MAP, ITEM_RARITY_PROBABILITIES} from "src/global/constants"
import {itemGradientClass} from "src/util/classes"

export default function RarityScale({highlightedRarity}) {
  return (
    <div className="mb-10 text-gray-light text-sm">
      <div className="flex justify-between items-center uppercase font-bold text-xs pb-2 px-2">
        <div>Rarity Scale</div>
        <div>Minting Chance</div>
      </div>
      {Object.keys(ITEM_RARITY_MAP)
        .reverse()
        .map(key => (
          <div
            key={key}
            className={`flex items-center border-t border-gray-200 py-1 px-2 ${
              Number(highlightedRarity) === Number(key) ? "bg-gray-200" : ""
            }`}
          >
            <div
              className={`${itemGradientClass(
                key
              )} w-2.5 h-2.5 rounded-full mr-3`}
            />
            <div className="">{ITEM_RARITY_MAP[key]}</div>
            <div className="ml-auto text-gray-darkest">
              {ITEM_RARITY_PROBABILITIES[key]}%
            </div>
          </div>
        ))}
    </div>
  )
}

RarityScale.propTypes = {
  highlightedRarity: PropTypes.number,
}
