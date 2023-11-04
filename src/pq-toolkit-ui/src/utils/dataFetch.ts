export const fetchJsonData = async (url: string): Promise<any> => {
  const sleep = async (ms: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
  await sleep(1000) // sleep

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const text = await response.text()
    const data = JSON.parse(text)
    return data
  } catch (err) {
    throw new Error('Invalid JSON file')
  }
}
