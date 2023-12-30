import path from 'path'
import { NextResponse } from 'next/server'
import { readJsonFile, getExperimentResultsPath } from '@/app/api/v1/utils'

export const GET = async (
  request: Request,
  { params }: { params: { name: string; resultId: string } }
): Promise<Response> => {
  const name = params.name
  const id = params.resultId

  try {
    const jsonData = readJsonFile(
      path.resolve(getExperimentResultsPath(name), id)
    )
    return Response.json(jsonData)
  } catch (error) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }
}
