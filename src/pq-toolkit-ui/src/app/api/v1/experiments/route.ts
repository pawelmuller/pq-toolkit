import fs from 'fs'
import path from 'path'

const readJsonFile = (filePath: string, fileName: string): any => {
  const dir = path.resolve(filePath)
  const data = fs.readFileSync(path.resolve(dir, fileName), 'utf8')
  return JSON.parse(data)
}

export const GET = async (): Promise<Response> => {
  const jsonData = readJsonFile('./public/examples/experiments', 'index.json')

  return Response.json(jsonData)
}

export const POST = async (request: Request): Promise<Response> => {
  const body = await request.json()

  const jsonData: { experiments: string[] } = readJsonFile(
    './public/examples/experiments',
    'index.json'
  )
  const { experiments } = jsonData
  experiments.push(body.name)

  fs.writeFileSync(
    './public/examples/experiments/index.json',
    JSON.stringify({ experiments })
  )

  return Response.json({ experiments })
}
