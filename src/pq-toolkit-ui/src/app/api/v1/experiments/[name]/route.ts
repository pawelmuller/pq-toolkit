import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import { getExperimentBasePath, readJsonFile, writeJsonFile } from '../../utils'

/**
 * @swagger
 * /api/v1/experiments/{name}:
 *  get:
 *   tags:
 *    - experiments
 *   description: Returns the setup of an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Setup of the experiment, for schema see generated TypeDoc docs
 */
export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const experimentName = params.name
  try {
    const jsonData = readJsonFile(
      path.resolve(getExperimentBasePath(experimentName), 'setup.json')
    )
    return Response.json(jsonData)
  } catch (error) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 })
  }
}

/**
 * @swagger
 * /api/v1/experiments/{name}:
 *  post:
 *   tags:
 *    - experiments
 *   description: Uploads the setup of an experiment
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

  // parse file content
  const jsonContent = await JSON.parse(await file.text())
  const filePath = path.resolve(getExperimentBasePath(name), 'setup.json')
  writeJsonFile(filePath, jsonContent)

  console.log(`Uploaded setup file to ${filePath}`)
  return NextResponse.json({ success: true })
}
