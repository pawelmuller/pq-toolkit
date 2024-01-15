/**
 * @swagger
 * /api/v1/status:
 *   get:
 *    tags:
 *     - status
 *    description: Returns the status of the API
 *    responses:
 *     200:
 *      description: Healthy
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 */
export const GET = async (): Promise<Response> => {
  return Response.json({ status: 'HEALTHY' })
}
