export const GET = async (): Promise<Response> => {
  return Response.json({ status: 'HEALTHY' })
}
