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

  const dir = `./public/examples/experiments/${body.name}`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  return Response.json({ experiments })
}

export const DELETE = async (request: Request): Promise<Response> => {
  const body = await request.json()

  const jsonData: { experiments: string[] } = readJsonFile(
    './public/examples/experiments',
    'index.json'
  )
  const { experiments } = jsonData
  const filteredExperiments = experiments.filter((item) => item !== body.name)

  fs.writeFileSync(
    './public/examples/experiments/index.json',
    JSON.stringify({ experiments: filteredExperiments })
  )

  const dir = `./public/examples/experiments/${body.name}`

  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  return Response.json({ experiments })
}
