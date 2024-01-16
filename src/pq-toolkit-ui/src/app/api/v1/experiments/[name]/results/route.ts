import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import {
  getExperimentResultsPath,
  getFilesInDir,
  writeJsonFile
} from '../../../utils'

/**
 * @swagger
 * /api/v1/experiments/{name}/results:
 *  get:
 *   tags:
 *    - experiment results
 *   description: Returns the list of results of an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: List of results
 *     content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          results:
 *            type: array
 *            items:
 *             type: string
 */
export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
): Promise<Response> => {
  const name = params.name

  const dirPath = getExperimentResultsPath(name)
  const files = getFilesInDir(dirPath, '.json')

  return NextResponse.json({ results: files })
}

/**
 * @swagger
 * /api/v1/experiments/{name}/results:
 *  post:
 *   tags:
 *    - experiment results
 *   description: Uploads a result to an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        success:
 *         type: boolean
 *   responses:
 *    200:
 *     description: Success
 */
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
