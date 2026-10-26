'use client';
import { SWRConfig } from 'swr';
import { type z } from 'zod';
import { type APIError, type APIResult } from '@/types/api';

const fetcher = async <T,>(url: RequestInfo | URL): Promise<T> => {
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!res.ok) {
    const error: APIError = {
      msg: res.statusText,
      status: res.status
    };
    throw new Error(JSON.stringify(error));
  }

  return await res.json();
};

export const SWRConfigProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
};

export const validateApiData = <T,>(
  data: unknown,
  schema: z.Schema<T>
): APIResult<T> => {
  const parsed = schema.safeParse(data);
  if (parsed.success) return { data: parsed.data, error: null };
  return { 
    data: null, 
    error: { 
      msg: parsed.error.message,
      status: 400
    } 
  };
};
