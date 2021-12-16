import useLogin from "src/hooks/useLogin"

export default function ListItemLogInWarning() {
  const logIn = useLogin()

  return (
    <div className="text-sm text-center mt-2 text-gray-600">
      <button
        onClick={logIn}
        className="hover:opacity-80 font-bold underline mx-1"
      >
        Log in
      </button>
      to purchase this Kitty Item.
    </div>
  )
}
