import { createSwaggerSpec } from 'next-swagger-doc'

import 'server-only'

export const getApiDocs = async (): Promise<object> => {
  const spec = createSwaggerSpec({
    apiFolder: '/src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'PQ Toolkit API',
        version: '1.0'
      },
      components: {},
      security: [],
      tags: [
        {
          name: 'status'
        },
        {
          name: 'experiments'
        },
        {
          name: 'experiment samples'
        },
        {
          name: 'experiment results'
        }
      ]
    }
  })
  return spec
}
