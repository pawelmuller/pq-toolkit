import { getExperimentSamplesPath, readFile } from '@/app/api/v1/utils'
import { NextResponse } from 'next/server'
import path from 'path'

export const GET = async (
  request: Request,
  { params }: { params: { name: string; fileName: string } }
): Promise<Response> => {
  const { name, fileName } = params

  const dataBuffer = readFile(
    path.resolve(getExperimentSamplesPath(name), fileName)
  )

  const headers = new Headers()
  headers.set('Content-Type', 'audio/mpeg')
  headers.set('Content-Length', dataBuffer.length.toString())
  headers.set('Accept-Ranges', 'bytes')
  return new NextResponse(dataBuffer, {
    status: 200,
    statusText: 'OK',
    headers
  })
}
