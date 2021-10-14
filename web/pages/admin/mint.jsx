import PageTitle from "src/components/PageTitle"
import useMinter from "src/hooks/useMinter"

export default function Mint() {
  const onSuccess = data => {
    console.log(data)
  }

  const [{isLoading}, mint] = useMinter(onSuccess)

  return (
    <div>
      <PageTitle>Mint</PageTitle>
      <main>
        <h1>Mint</h1>
        <br />
        <button
          className="bg-gray-200 hover:bg-gray-100 rounded-4"
          onClick={mint}
          disabled={isLoading}
        >
          Mint Item
        </button>
      </main>
    </div>
  )
}
