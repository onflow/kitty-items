export default function ServerErrorMessage(args) {
    const message = `Status Code: ${args.statusCode}`;

    return (
    <div className="flex justify-center my-12 text-center">
        <div className="bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center">
            <h1 className="text-3xl font-semibold mb-6">{message}</h1>
            <div className="bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center">
                <b>Sorry, the page you are looking for was not found.</b>
            </div>
        </div>
    </div>
    )
}
