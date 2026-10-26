import { type z } from 'zod';

export const apiFetch = async <T>(
  url: string,
  schema: z.Schema<T>
): Promise<T> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    next: { revalidate: 0 }
  });

  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};
