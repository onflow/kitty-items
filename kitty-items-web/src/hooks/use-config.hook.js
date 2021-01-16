import {useEffect, useState} from "react"
import {config} from "@onflow/fcl"

export function useConfig(key, fallback) {
  const [value, setValue] = useState(null)

  useEffect(() => {
    config().get(key, fallback).then(setValue)
  }, [key, fallback])

  return value
}
