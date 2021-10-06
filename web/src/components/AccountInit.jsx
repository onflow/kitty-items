import useAccountInitializer from "src/hooks/useAccountInitializer"

export default function AccountInit() {
  const {isInitialized, initializeAccount} = useAccountInitializer()

  if (isInitialized === true) return null
  return (
    <div>
      <button onClick={initializeAccount}>Initialize</button>
    </div>
  )
}
