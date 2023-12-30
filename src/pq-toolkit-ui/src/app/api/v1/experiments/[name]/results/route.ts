import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import {
  getExperimentResultsPath,
  getFilesInDir,
  writeJsonFile
} from '../../../utils'

export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const name = params.name

  const dirPath = getExperimentResultsPath(name)
  const files = getFilesInDir(dirPath, '.json')

  return NextResponse.json({ results: files })
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const name = params.name
  const data = await request.json()

  const filePath = path.resolve(
    getExperimentResultsPath(name),
    `result-${new Date()
      .toISOString()
      .replaceAll(':', '-')
      .replaceAll('.', '-')}.json`
  )
  writeJsonFile(filePath, data)

  console.log(`Saved result to ${filePath}`)
  return NextResponse.json({ success: true })
}
