import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export const GET = async (
  request: Request,
  { params }: { params: { name: string, fileName: string } }
): Promise<Response> => {
  const { name, fileName } = params
  const data = fs.readFileSync(
    path.resolve('./public/examples/experiments', name, 'samples', fileName)
  )

  const headers = new Headers()
  headers.set('Content-Type', 'audio/mpeg')
  return new NextResponse(data, { status: 200, statusText: 'OK', headers })
}
