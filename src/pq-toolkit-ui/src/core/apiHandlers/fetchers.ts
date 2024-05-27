import { type z } from 'zod'

interface APIError {
    msg: string
    status: number
}
  
export const authorizedFetch = async (url: RequestInfo | URL): Promise<any> => {
    const res = await fetch(url, { headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` } })

    if (!res.ok) {
        const error: APIError = {
            msg: res.statusText,
            status: res.status
        }
        throw new Error(JSON.stringify(error))
    }

    return await res.json()
}

export const userFetch = async (url: RequestInfo | URL): Promise<any> => {
    const res = await fetch(url, {method:'POST', headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` } })

    if (!res.ok) {
        const error: APIError = {
            msg: res.statusText,
            status: res.status
        }
        throw new Error(JSON.stringify(error))
    }

    return await res.json()
}

export const loginFetch = async <T>(password: string, schema: z.Schema<T>): Promise<T> => {
    const body = new URLSearchParams({ grant_type: 'password', username: 'admin', password, client_id: 'string', client_secret: 'string' })
    const response = await fetch("/api/v1/auth/login", {method:'POST',
        headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
        next: { revalidate: 0 },
        body
      })
    
      if (!response.ok)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
    
      const data = await response.json()
      const parsed = schema.parse(data)
    
      return parsed
}

export const deleteExperimentFetch = async <T>(name: string, schema: z.Schema<T>): Promise<T> => {
    const body = JSON.stringify({ name })
    const response = await fetch('/api/v1/experiments', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, next: { revalidate: 0 },
        body
    });
    
    if (!response.ok)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
    
      const data = await response.json()
      const parsed = schema.parse(data)
    
      return parsed
}
  
export const addNewExperimentFetch = async <T>(name: string, schema: z.Schema<T>): Promise<T> => {
    const body = JSON.stringify({ name })
    const response = await fetch('/api/v1/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, next: { revalidate: 0 },
        body
      })
    
      if (!response.ok)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
    
      const data = await response.json()
      const parsed = schema.parse(data)
    
      return parsed
}