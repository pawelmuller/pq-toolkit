import path from 'path'
import { NextResponse } from 'next/server'
import { readJsonFile, getExperimentResultsPath } from '@/app/api/v1/utils'

/**
 * @swagger
 * /api/v1/experiments/{name}/results/{resultId}:
 *  get:
 *   tags:
 *    - experiment results
 *   description: Returns a result of an experiment
 *   parameters:
 *    - in: path
 *      name: name
 *      required: true
 *      description: Name of the experiment
 *      schema:
 *       type: string
 *    - in: path
 *      name: resultId
 *      required: true
 *      description: Name of the result
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Result of an experiment, for schema see generated TypeDoc docs
 */
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
