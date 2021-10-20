import PropTypes from "prop-types"
import publicConfig from "src/global/publicConfig"
const SEED = "kitty-items"

const avatarUrl = hash =>
  encodeURI(
    `${publicConfig.avatarUrl.trim().replace(/\/$/, "")}/avatar/${hash}.svg`
  )

export default function Avatar({address}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl(avatarUrl, `${address}-${SEED}`)}
      alt={address}
      className="border border-gray-200 rounded-3xl"
    />
  )
}

Avatar.propTypes = {
  address: PropTypes.string.isRequired,
}
