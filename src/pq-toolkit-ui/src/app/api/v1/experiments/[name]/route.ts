import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'
import { type NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const name = params.name
  const dir = path.resolve('./public/examples/experiments', name)
  const data = fs.readFileSync(path.resolve(dir, 'setup.json'), 'utf8') // TODO: check if file exists
  const jsonData = JSON.parse(data)

  return Response.json(jsonData)
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const name = params.name

  if (file == null || name == null) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = `./public/examples/experiments/${name}/${file.name}`
  await writeFile(path, buffer, 'utf-8')
  console.log(`uploaded ${path}`)

  return NextResponse.json({ success: true })
}
