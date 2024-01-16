import { getExperimentSamplesPath, readFile } from '@/app/api/v1/utils'
import { NextResponse } from 'next/server'
import path from 'path'
import { existsSync } from 'fs'

/**
 * @swagger
 * /api/v1/experiments/{name}/samples/{fileName}:
 *  get:
 *   tags:
 *    - experiment samples
 *   description: Returns a sample of an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *    - in: path
 *      name: fileName
 *      required: true
 *      description: Name of the sample
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Sample
 *     content:
 *      audio/mpeg:
 *       schema:
 *        type: string
 *        format: binary
 */
export const GET = async (
  request: Request,
  { params }: { params: { name: string; fileName: string } }
): Promise<Response> => {
  const { name, fileName } = params

  if (!existsSync(path.resolve(getExperimentSamplesPath(name), fileName))) {
    return new NextResponse(null, {
      status: 404,
      statusText: 'Not Found'
    })
  }

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
