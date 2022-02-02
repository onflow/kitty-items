import {useRouter} from "next/router"
import {flashMessages} from "src/global/constants"
import "src/global/fclConfig"
import useAppContext from "src/hooks/useAppContext"

export default function FlashMessage() {
  const {flashMessage: contextFlashMessage, setFlashMessage} = useAppContext()
  const router = useRouter()

  if (router.query.flash) {
    const flashMessage = flashMessages[router.query.flash]
    const query = router.query
    delete query.flash
    router
      .replace({
        pathname: router.pathname,
        query,
      })
      .then(() => {
        setFlashMessage(flashMessage)
      })
  }

  const clearFlashMessage = () => {
    setFlashMessage(null)
  }

  const flashMessage = contextFlashMessage
  if (!flashMessage) return null

  return (
    <div className="main-container mt-10">
      <div
        className={`${
          flashMessage.type === "error"
            ? "bg-red text-white"
            : "bg-gray-darkest bg-opacity-10 text-gray-700"
        } py-4 flex items-center justify-center rounded-lg relative`}
      >
        {flashMessage.message}

        <button onClick={clearFlashMessage} className="absolute right-5">
          ✕
        </button>
      </div>
    </div>
  )
}
