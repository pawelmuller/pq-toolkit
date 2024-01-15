import { type NextRequest, NextResponse } from 'next/server'
import { getExperimentSamplesPath, writeFile } from '../../../utils'
import { readdirSync } from 'fs'

/**
 * @swagger
 * /api/v1/experiments/{name}/samples:
 *  get:
 *   tags:
 *    - experiment samples
 *   description: Returns the list of samples of an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: List of samples
 *     content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          type: string
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const { name } = params

  const samplesPath = getExperimentSamplesPath(name)
  const samples = readdirSync(samplesPath)

  return NextResponse.json(samples)
}

/**
 * @swagger
 * /api/v1/experiments/{name}/samples:
 *  post:
 *   tags:
 *    - experiment samples
 *   description: Uploads a sample to an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        file:
 *         type: string
 *         format: binary
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Missing file in request body
 */
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
