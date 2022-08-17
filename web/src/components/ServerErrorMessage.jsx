export default function ServerErrorMessage(args) {
    const statusMessage = `Status Code: ${args.statusCode}`;
    const message =
    args.statusCode >= 500 ?
    "Sorry, unknown error encountered." :
    "Sorry, the page you are looking for was not found.";

    return (
    <div className="flex justify-center my-12 text-center">
        <div className="bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center">
            <h1 className="text-3xl font-semibold mb-6">{statusMessage}</h1>
            <div className="bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center">
                <b>{message}</b>
            </div>
        </div>
    </div>
    )
}
