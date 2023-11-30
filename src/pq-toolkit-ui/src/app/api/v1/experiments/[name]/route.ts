import fs from 'fs'
import path from 'path'

export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const name = params.name
  const dir = path.resolve('./public', 'examples', 'experiments', name)
  const data = fs.readFileSync(path.resolve(dir, 'setup.json'), 'utf8') // TODO: check if file exists
  const jsonData = JSON.parse(data)

  return Response.json(jsonData)
}
