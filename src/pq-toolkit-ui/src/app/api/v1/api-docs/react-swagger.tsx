'use client'

import SwaggerUI from 'swagger-ui-react'
import './reset.css'
import 'swagger-ui-react/swagger-ui.css'

interface Props {
  spec: Record<string, any>
}

function ReactSwagger({ spec }: Props): JSX.Element {
  return <SwaggerUI spec={spec} />
}

export default ReactSwagger
