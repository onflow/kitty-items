import {paths} from "src/global/constants"
import {
  EVENT_ITEM_MINTED,
  EVENT_KITTY_ITEM_DEPOSIT,
  getKittyItemsEventByType,
} from "src/util/events"

export const HYDRATE = "HYDRATE"
export const RESET = "RESET"
export const ADD = "ADD"
export const UPDATE = "UPDATE"
export const REMOVE = "REMOVE"

export const initialState = {
  addr: undefined,
  transactions: [],
  lastChangedTx: undefined,
}

const hasTxStatusChanged = (prevData, newData) =>
  prevData?.data?.status !== newData.data?.status ||
  prevData?.data?.errorMessage !== newData.data?.errorMessage

const getLastChangedTx = (state, payload) => {
  const prevTx = state.transactions.find(tx => tx.id === payload.id)
  if (hasTxStatusChanged(prevTx, payload))
    return {id: payload.id, data: payload.data}
  return state.lastChangedTx
}

const newUpdateTransactionPayload = tx => {
  // Set new item url on purchase
  const depositEvent = getKittyItemsEventByType(
    tx.data.events,
    EVENT_KITTY_ITEM_DEPOSIT
  )
  if (!!depositEvent) {
    return {
      ...tx,
      url: paths.profileItem(depositEvent.data.to, depositEvent.data.id),
    }
  }

  // Set new item url on mint
  const mintEvent = getKittyItemsEventByType(tx.data.events, EVENT_ITEM_MINTED)
  if (!!mintEvent) {
    return {
      ...tx,
      url: paths.profileItem(publicConfig.flowAddress, depositEvent.data.id),
    }
  }

  return tx
}

export const transactionsReducer = (state, action) => {
  const {type, payload} = action
  switch (type) {
    case HYDRATE:
      return action.payload
    case RESET:
      return initialState
    case ADD:
      if (!!state.addr && state.addr !== payload.addr) return initialState
      return {
        ...state,
        addr: payload.addr,
        transactions: [...state.transactions, payload.tx],
      }
    case REMOVE:
      return {
        ...state,
        transactions: state.transactions.filter(tx => payload !== tx.id),
      }
    case UPDATE:
      const transactions = state.transactions.map(prevTx => {
        if (prevTx.id === payload.id) {
          const newPayload = newUpdateTransactionPayload(payload)
          return {...prevTx, ...newPayload}
        }
        return prevTx
      })

      return {
        ...state,
        transactions,
        lastChangedTx: getLastChangedTx(state, payload),
      }
    default:
      throw new Error("Incorrect transactionsReducer action type")
  }
}
