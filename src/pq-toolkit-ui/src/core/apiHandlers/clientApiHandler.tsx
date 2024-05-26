'use client'
import { SWRConfig } from 'swr'
import { type z } from 'zod'

interface APIError {
  msg: string
  status: number
}

const fetcher = async (url: RequestInfo | URL): Promise<unknown> => {
  const res = await fetch(url, { headers: { 'accept': 'application/json' } })

  if (!res.ok) {
    const error: APIError = {
      msg: res.statusText,
      status: res.status
    }
    throw new Error(JSON.stringify(error))
  }

  return await res.json()
}

export const SWRConfigProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
}

export const validateApiData = <T,>(
  data: unknown,
  schema: z.Schema<T>
):
  | { data: T; validationError: null }
  | { data: null; validationError: string } => {
  const parsed = schema.safeParse(data)
  if (parsed.success) return { data: parsed.data, validationError: null }
  return { data: null, validationError: parsed.error.message }
}
