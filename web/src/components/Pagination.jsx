import PropTypes from "prop-types"

const INITIAL_MAX_PAGES = 5

const BASE_PAGINATION_BUTTON_CLASSES =
  "border border-gray-200 w-10 h-10 rounded-md mx-1 flex items-center justify-center text-sm text-gray-dark"

const PaginationButton = ({currentPage, page, onPageClick}) => {
  const isCurrent = page === currentPage

  return (
    <button
      disabled={isCurrent}
      className={`${BASE_PAGINATION_BUTTON_CLASSES} ${
        isCurrent ? "bg-green border-green cursor-default" : "hover:bg-gray-100"
      }`}
      onClick={() => onPageClick(page)}
    >
      {page}
    </button>
  )
}

export default function Pagination({total, perPage, currentPage, onPageClick}) {
  const totalPages = Math.ceil(total / perPage)
  const maxPages = Math.min(totalPages, INITIAL_MAX_PAGES)
  const showLastPage = totalPages > maxPages
  const showEllipsis = totalPages > maxPages + 1
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center">
      {Array(maxPages)
        .fill(0)
        .map((_a, index) => (
          <PaginationButton
            key={index}
            currentPage={currentPage}
            onPageClick={onPageClick}
            page={index + 1}
          />
        ))}
      {showLastPage && (
        <>
          {showEllipsis && (
            <div className={BASE_PAGINATION_BUTTON_CLASSES}>...</div>
          )}
          <PaginationButton
            currentPage={currentPage}
            page={totalPages}
            onPageClick={onPageClick}
          />
        </>
      )}
    </div>
  )
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
}

PaginationButton.propTypes = {
  currentPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
}
