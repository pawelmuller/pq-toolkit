export const GET = async (): Promise<Response> => {
  const data = {
    message: 'Hello world!'
  }

  return Response.json({ ...data })
}
