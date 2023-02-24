export const request = async ({
  url,
  method = "GET",
  body = null,
  headers = {},
  parseResponse = true,
  timeout,
}) => {
  const requestParams = {
    method,
    headers,
    body,
  }

  const controller = new AbortController()
  const timeoutId = timeout
    ? setTimeout(() => controller.abort(), timeout)
    : null

  const response = await fetch(url, {
    ...requestParams,
    signal: timeout != null ? controller.signal : undefined,
  }).catch(e => {
    // http status not present
    throw new Error(
      `${method} ${url} has failed with the following error: ${e}`
    )
  })

  timeoutId != null && clearTimeout(timeoutId)

  if (!response) {
    // http status not present
    throw new Error(`No response from ${method} ${url}`)
  }

  const responseText = await response.text()

  if (response.status >= 300) {
    throw new Error(
      `${method} ${url} returned error: ${response.status} on payload: ${requestParams.body} with response: ${responseText}`,
      response.status,
      requestParams.headers,
      responseText,
      url,
      method
    )
  }

  if (!parseResponse) {
    return responseText
  }

  try {
    return JSON.parse(responseText)
  } catch (e) {
    throw new Error(
      `Getting body of response from ${url} has failed with the following error: ${e}`
    )
  }
}
