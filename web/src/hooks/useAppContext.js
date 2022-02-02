import {useContext} from "react"
import {AppContext} from "src/contexts/AppContext"

export default function useAppContext() {
  return useContext(AppContext)
}
