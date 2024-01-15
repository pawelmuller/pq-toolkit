import { type NextRequest, NextResponse } from 'next/server'
import { getExperimentSamplesPath, writeFile } from '../../../utils'
import { readdirSync } from 'fs'

export const GET = async (
  request: NextRequest,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const { name } = params

  const samplesPath = getExperimentSamplesPath(name)
  const samples = readdirSync(samplesPath)

  return NextResponse.json(samples)
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const name = params.name

  if (file == null) {
    return NextResponse.json(
      { message: 'Missing file in request body' },
      { status: 400 }
    )
  }

  const path = getExperimentSamplesPath(name)
  await writeFile(path, file.name, file)
  console.log(`Uploaded sample ${file.name} to ${path}`)

  return NextResponse.json({ success: true })
}
