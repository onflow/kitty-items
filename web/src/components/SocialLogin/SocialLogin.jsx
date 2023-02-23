import {useEffect} from "react"
const ENDPOINT = "ext:RandWeb3AuthUniqueString"
const VERSION = "1.0.0"
export default function SocialLogin() {
  useEffect(() => {
    window.fcl_extensions.push({
      f_type: "Service",
      f_vsn: VERSION,
      type: "authn",
      uid: "web3#authn",
      endpoint: ENDPOINT,
      method: "EXT/RPC",
      id: "0x0",
      identity: {
        f_type: "Identity",
        f_vsn: VERSION,
        address: "0x0",
        keyId: 0,
      },
      provider: {
        f_type: "ServiceProvider",
        f_vsn: VERSION,
        address: "0x0",
        name: "Web3",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zNSAxMjhDMzUgNzYuNjM3NSA3Ni42Mzc1IDM1IDEyOCAzNUMxNzkuMzYyIDM1IDIyMSA3Ni42Mzc1IDIyMSAxMjhDMjIxIDE3OS4zNjIgMTc5LjM2MiAyMjEgMTI4IDIyMUM3Ni42Mzc1IDIyMSAzNSAxNzkuMzYyIDM1IDEyOFoiIGZpbGw9IiMyMTIxMjEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMjggMjEyLjI4MUMxNjcuMzUxIDIxMi4yODEgMjAwLjM2NyAxODUuMDA1IDIwOS4zNzUgMTQ4LjIyN0gxODEuMzM2QzE3My4yMDYgMTY5Ljg5OCAxNTIuMzkzIDE4NS4zMTEgMTI4IDE4NS4zMTFDMTAzLjYwNyAxODUuMzExIDgyLjc5MzkgMTY5Ljg5OCA3NC42NjQxIDE0OC4yMjdINDYuNjI1QzU1LjYzMzQgMTg1LjAwNSA4OC42NDk0IDIxMi4yODEgMTI4IDIxMi4yODFaTTEyOCA0My43MTg4QzE2Ny4zNTEgNDMuNzE4OCAyMDAuMzY3IDcwLjk5NDUgMjA5LjM3NSAxMDcuNzcySDE4MS4zMzZDMTczLjIwNiA4Ni4xMDE5IDE1Mi4zOTMgNzAuNjg4NyAxMjggNzAuNjg4N0MxMDMuNjA3IDcwLjY4ODcgODIuNzkzOSA4Ni4xMDE5IDc0LjY2NDEgMTA3Ljc3Mkg0Ni42MjVDNTUuNjMzNCA3MC45OTQ1IDg4LjY0OTQgNDMuNzE4OCAxMjggNDMuNzE4OFpNMTEzLjI1IDEwNy43NzJDMTEwLjI4OCAxMDcuNzcyIDEwNy44ODcgMTEwLjE4NyAxMDcuODg3IDExMy4xNjZWMTQyLjgzNEMxMDcuODg3IDE0NS44MTMgMTEwLjI4OCAxNDguMjI3IDExMy4yNSAxNDguMjI3SDE0Mi43NUMxNDUuNzEyIDE0OC4yMjcgMTQ4LjExMyAxNDUuODEzIDE0OC4xMTMgMTQyLjgzNFYxMTMuMTY2QzE0OC4xMTMgMTEwLjE4NyAxNDUuNzEyIDEwNy43NzIgMTQyLjc1IDEwNy43NzJIMTEzLjI1WiIgZmlsbD0iI0M2RkYwMCIvPgo8L3N2Zz4K",
        description: "Web3",
        website: "",
      },
    })

  return null
}
