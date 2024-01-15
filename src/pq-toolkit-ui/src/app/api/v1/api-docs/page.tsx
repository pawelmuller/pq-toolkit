import { getApiDocs } from '@/app/api/v1/swagger'
import ReactSwagger from './react-swagger'

export default async function IndexPage(): Promise<JSX.Element> {
  const spec = await getApiDocs()
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}
