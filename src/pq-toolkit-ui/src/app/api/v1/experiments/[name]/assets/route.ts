import fs from 'fs'
import { writeFile } from 'fs/promises'
import { type NextRequest, NextResponse } from 'next/server'

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

  const dir = `./public/examples/experiments/${name}/samples`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const path = `./public/examples/experiments/${name}/samples/${file.name}`
  await writeFile(path, buffer)
  console.log(`uploaded ${path}`)

  return NextResponse.json({ success: true })
}
