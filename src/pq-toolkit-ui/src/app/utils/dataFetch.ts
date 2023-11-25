export const fetchJsonData = async (url: string): Promise<any> => {
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
    console.log(err)
    throw new Error('Invalid JSON file')
  }
}
