import { type ExperimentSetup } from '@/lib/schemas/experimentSetup';
import { type z } from 'zod';

interface APIError {
  msg: string
  status: number
}

export const authorizedFetch = async (url: RequestInfo | URL): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error: APIError = {
      msg: response.statusText,
      status: response.status
    };
    throw new Error(JSON.stringify(error));
  }

  return await response.json();
};

export const userFetch = async (url: RequestInfo | URL): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error: APIError = {
      msg: response.statusText,
      status: response.status
    };
    throw new Error(JSON.stringify(error));
  }

  return await response.json();
};

export const loginFetch = async <T>(
  password: string,
  schema: z.Schema<T>
): Promise<T> => {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: 'admin',
    password,
    client_id: 'string',
    client_secret: 'string'
  })
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    next: { revalidate: 0 },
    body
  });

  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`)

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const deleteExperimentFetch = async <T>(
  name: string,
  schema: z.Schema<T>
): Promise<T> => {
  const body = JSON.stringify({ name });
  const response = await fetch('/api/v1/experiments', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    next: { revalidate: 0 },
    body
  });

  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const addNewExperimentFetch = async <T>(
  name: string,
  schema: z.Schema<T>
): Promise<T> => {
  const body = JSON.stringify({ name });
  const response = await fetch('/api/v1/experiments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    next: { revalidate: 0 },
    body
  });

  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const setUpExperimentFetch = async <T>(experimentName: string, experimentJSON: ExperimentSetup, schema: z.Schema<T>): Promise<T> => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(experimentJSON)], {type: 'application/json'});
  formData.append('file', jsonBlob, 'setup.json');

  const response = await fetch(`/api/v1/experiments/${experimentName}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const parsed = schema.parse(data);
  return parsed;
};

export const getExperimentFetch = async <T>(
  experimentName: string,
  schema: z.Schema<T>
): Promise<T> => {
  const response = await fetch(`/api/v1/experiments/${experimentName}`, {
    headers: { accept: 'application/json' }
  });
  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const uploadSampleFetch = async <T>(
  experimentName: string,
  sample: File,
  sampleName: string,
  schema: z.Schema<T>
): Promise<T> => {
  const formData = new FormData();
  formData.append('file', sample, sampleName);

  const response = await fetch(
    `/api/v1/experiments/${experimentName}/samples`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }
  );
  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const getSamplesFetch = async <T>(
  experimentName: string,
  schema: z.Schema<T>
): Promise<T> => {
  const response = await fetch(
    `/api/v1/experiments/${experimentName}/samples`,
    { headers: { accept: 'application/json' } }
  );
  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const parsed = schema.parse(data);

  return parsed;
};

export const getSampleFetch = async <T>(
  experimentName: string,
  fileName: string,
  schema: z.Schema<T>
): Promise<T> => {
  const response = await fetch(
    `/api/v1/experiments/${experimentName}/samples/${fileName}`,
    { headers: { accept: 'application/json' } }
  );
  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  const data = await response.text();
  const parsed = schema.parse(data);

  return parsed;
};

export const uploadSampleRateFetch = async (
  sample: { sampleId: string, name: string; assetPath: string; rating: number | null }
): Promise<void> => {
  const response = await fetch('/api/v1/samples/rate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(sample),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
};

export const uploadSamplesFetch = async (
  files: File[],
  titles: string[]
): Promise<void> => {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append('files', file);
    formData.append('titles', titles[index]);
  });

  const response = await fetch('/api/v1/samples', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
};

export const fetchSamples = async (): Promise<any> => {
    const response = await fetch('/api/v1/samples');
    if (!response.ok) {
        throw new Error(`Failed to fetch samples: ${response.statusText}`);
    }
    return response.json();
};
